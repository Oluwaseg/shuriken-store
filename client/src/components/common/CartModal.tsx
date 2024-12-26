import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
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
      dispatch(fetchCart(userInfo.id));
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
  }, [cart, isAuthenticated, productDetails]);

  const handleViewAll = () => {
    navigate('/cart');
    onClose();
  };

  const handleQuantityChange = async (
    itemId: string | Product,
    newQuantity: number
  ) => {
    const productId = typeof itemId === 'string' ? itemId : itemId._id;
    const product =
      productDetails[productId] || (typeof itemId === 'object' ? itemId : null);

    if (!product) {
      toast.error(`Product details for item ${itemId} not available.`);
      return;
    }

    if (newQuantity <= 0) {
      return handleRemoveItem(productId);
    }

    if (isAuthenticated && userInfo?.id) {
      try {
        await dispatch(
          addOrUpdateCart({
            userId: userInfo.id,
            productId: productId,
            quantity: newQuantity,
            price: product.price,
          })
        );
        await dispatch(fetchCart(userInfo.id));

        if (!productDetails[productId]) {
          const updatedProduct = await getProductById(productId);
          if (updatedProduct?.product) {
            setProductDetails((prevState) => ({
              ...prevState,
              [productId]: updatedProduct.product,
            }));
          }
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Error updating cart');
      }
    } else {
      try {
        const localCart: Cart = JSON.parse(
          localStorage.getItem('cart') || 'null'
        ) || { items: [] };

        const existingItem = localCart.items.find(
          (item) => item.product === itemId
        );

        if (existingItem) {
          existingItem.quantity = newQuantity;
        } else {
          localCart.items.push({
            product: itemId,
            quantity: newQuantity,
            price: product.price,
          });
        }

        localStorage.setItem('cart', JSON.stringify(localCart));
        dispatch(setLocalCart(localCart));

        if (!productDetails[productId]) {
          const updatedProduct = await getProductById(productId);
          if (updatedProduct?.product) {
            setProductDetails((prevState) => ({
              ...prevState,
              [productId]: updatedProduct.product,
            }));
          }
        }
      } catch (error) {
        console.error('Error updating local cart:', error);
        toast.error('Error updating local cart');
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
      const emptyCart = {
        id: '',
        user: '',
        items: [],
        total: 0,
        tax: 0,
        shipping: 0,
      };

      dispatch(setLocalCart(emptyCart));
      toast.success('Cart cleared!');
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
        className='bg-body-light dark:bg-body-dark shadow-xl rounded-lg w-full max-w-md overflow-hidden'
      >
        <div className='p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className='text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors'
          >
            <IoClose size={24} />
          </button>
        </div>

        <ScrollArea className='h-[60vh]'>
          {cart && cart.items && cart.items.length > 0 ? (
            <ul className='divide-y divide-border-light dark:divide-border-dark'>
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
                    <div className='flex-shrink-0 w-16 h-16 bg-input-light dark:bg-input-dark rounded-md overflow-hidden'>
                      {product?.images && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className='w-full h-full object-cover'
                        />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate'>
                        {product ? product.name : 'Loading...'}
                      </p>
                      <div className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product as string,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className='text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
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
                            className='text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                          >
                            +
                          </button>

                          <div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.product as string)
                              }
                              className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                            >
                              <IoTrash size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex-shrink-0 text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
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
            <p className='p-4 text-text-secondary-light dark:text-text-secondary-dark text-center'>
              Your cart is empty.
            </p>
          )}
        </ScrollArea>

        <div className='p-4 border-t border-border-light dark:border-border-dark'>
          <p className='text-sm font-semibold text-text-primary-light dark:text-text-primary-dark'>
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
              className='w-full bg-accent-light dark:bg-accent-dark text-white dark:text-black px-4 py-2 rounded-md hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition-colors'
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
