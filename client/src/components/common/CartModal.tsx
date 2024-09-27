import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/product';
import {
  addOrUpdateCart,
  clearUserCart,
  fetchCart,
  removeCartItem,
  setLocalCart,
} from '../../features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Cart, Product, ProductsApiResponse } from '../../types/type';
import ScrollArea from '../ui/ScrollArea';

const CartModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [productDetails, setProductDetails] = useState<{
    [key: string]: Product | undefined;
  }>({});
  const cart = useAppSelector((state) => state.cart.cart);
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && userInfo?.id) {
      console.log('Auth state:', isAuthenticated, 'User ID:', userInfo?.id);

      dispatch(fetchCart(userInfo.id));
      console.log('Fetching cart for user:', userInfo.id);
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || 'null') || {
        items: [],
      };
      if (localCart.items.length > 0) {
        dispatch(setLocalCart(localCart));
      }
    }
  }, [isOpen, isAuthenticated, userInfo?.id, dispatch]);

  useEffect(() => {
    const fetchProductDetails = async (productId: string) => {
      if (!productDetails[productId]) {
        const response: ProductsApiResponse<Product> = await getProductById(
          productId
        );
        if (response.product) {
          setProductDetails((prevState) => ({
            ...prevState,
            [productId]: response.product,
          }));
        }
      }
    };

    if (cart && !isAuthenticated) {
      cart.items.forEach((item) => {
        if (typeof item.product === 'string') {
          fetchProductDetails(item.product);
        }
      });
    }
    console.log('Product details updated:', productDetails);
  }, [cart, isAuthenticated, productDetails]);

  const handleViewAll = () => {
    navigate('/cart');
    onClose();
  };

  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  const handleQuantityChange = async (
    itemId: string | Product,
    newQuantity: number
  ) => {
    const productId = typeof itemId === 'string' ? itemId : itemId._id;
    const product =
      productDetails[productId] || (typeof itemId === 'object' ? itemId : null);

    console.log('Product before quantity change:', product);

    if (!product) {
      console.error(`Product details for item ${itemId} not available.`);
      return;
    }

    // Update only if quantity is more than zero
    if (newQuantity <= 0) {
      return handleRemoveItem(productId);
    }

    // If user is authenticated, update the cart in the backend
    if (isAuthenticated && userInfo?.id) {
      try {
        // First, update the cart
        await dispatch(
          addOrUpdateCart({
            userId: userInfo.id,
            productId: productId,
            quantity: newQuantity,
            price: product.price,
          })
        );

        // Then, refetch the cart to get the latest state
        await dispatch(fetchCart(userInfo.id));

        // Optional: Re-fetch product details only if necessary
        if (!productDetails[productId]) {
          const updatedProduct = await getProductById(productId);
          if (updatedProduct?.product) {
            setProductDetails((prevState) => ({
              ...prevState,
              [productId]: updatedProduct.product,
            }));
            console.log(
              'Updated product details fetched:',
              updatedProduct.product
            );
          }
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      // Handle the local cart (unauthenticated users)
      try {
        const localCart: Cart = JSON.parse(
          localStorage.getItem('cart') || 'null'
        ) || { items: [] };

        const existingItem = localCart.items.find(
          (item) => item.product === itemId
        );

        if (existingItem) {
          // Update the quantity of the existing item
          existingItem.quantity = newQuantity;
        } else {
          // Push a new item if it doesn't exist (shouldn't happen if you handle correctly)
          localCart.items.push({
            product: itemId,
            quantity: newQuantity,
            price: product.price,
          });
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(localCart));

        // Update the local cart in the Redux state
        dispatch(setLocalCart(localCart));

        // Manually update product details if missing
        if (!productDetails[productId]) {
          const updatedProduct = await getProductById(productId);
          if (updatedProduct?.product) {
            setProductDetails((prevState) => ({
              ...prevState,
              [productId]: updatedProduct.product,
            }));
            console.log(
              'Updated product details fetched for local cart:',
              updatedProduct.product
            );
          }
        }
      } catch (error) {
        console.error('Error updating local cart:', error);
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (isAuthenticated && userInfo?.id) {
      await dispatch(
        removeCartItem({ userId: userInfo.id, productId: itemId })
      );
      await dispatch(fetchCart(userInfo.id));
    } else {
      const localCart: Cart = JSON.parse(
        localStorage.getItem('cart') || 'null'
      ) || { items: [] };
      localCart.items = localCart.items.filter(
        (item) => item.product !== itemId
      );
      localStorage.setItem('cart', JSON.stringify(localCart));
      dispatch(setLocalCart(localCart));
    }
  };

  const handleClearCart = () => {
    if (isAuthenticated && userInfo?.id) {
      dispatch(clearUserCart(userInfo.id));
    } else {
      localStorage.removeItem('cart');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalPrice = cart?.items?.reduce((total, item) => {
    const product =
      typeof item.product === 'string'
        ? productDetails[item.product]
        : item.product;
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-20 pr-4 z-50'>
      <div
        ref={modalRef}
        className='bg-white dark:bg-gray-800 shadow-xl rounded-lg w-full max-w-md overflow-hidden'
      >
        <div className='p-4 border-b dark:border-gray-700 flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors'
          >
            <IoClose size={24} />
          </button>
        </div>

        <ScrollArea className='h-[60vh]'>
          {cart && cart.items && cart.items.length > 0 ? (
            <ul className='divide-y dark:divide-gray-700'>
              {cart.items.map((item) => {
                const product =
                  typeof item.product === 'string'
                    ? productDetails[item.product]
                    : item.product;
                return (
                  <li
                    key={
                      product
                        ? String(product._id || item.product)
                        : String(item.product)
                    }
                    className='p-4 flex items-center space-x-4'
                  >
                    <div className='flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden'>
                      {product?.images && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className='w-full h-full object-cover'
                        />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                        {product ? product.name : 'Loading...'}
                      </p>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product as string,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className='text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product as string,
                                item.quantity + 1
                              )
                            }
                            className='text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                          >
                            +
                          </button>

                          <div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.product as string)
                              }
                              className='text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-500'
                            >
                              <IoTrash size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex-shrink-0 text-sm font-medium text-gray-900 dark:text-white'>
                      $
                      {product
                        ? (product.price * item.quantity).toFixed(2)
                        : '-.--'}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className='p-4 text-gray-500 dark:text-gray-400 text-center'>
              Your cart is empty.
            </p>
          )}
        </ScrollArea>

        <div className='p-4 border-t dark:border-gray-700'>
          <p className='text-sm font-semibold text-gray-900 dark:text-white'>
            Total: ${totalPrice?.toFixed(2)}
          </p>
          <div className='mt-4 flex space-x-2'>
            <button
              onClick={handleClearCart}
              className='w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors'
            >
              Clear Cart
            </button>
            <button
              onClick={handleViewAll}
              className='w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors'
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
