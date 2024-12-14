import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoTrash } from 'react-icons/io5';
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

const CartPage: React.FC = () => {
  const [productDetails, setProductDetails] = useState<{
    [key: string]: Product | undefined;
  }>({});
  const cart = useAppSelector((state) => state.cart.cart);
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userInfo?.id) {
      dispatch(fetchCart(userInfo.id));
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || 'null') || {
        items: [],
      };
      if (localCart.items.length > 0) {
        dispatch(setLocalCart(localCart));
      }
    }
  }, [isAuthenticated, userInfo?.id, dispatch]);

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

  useEffect(() => {}, [cart]);

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
          }
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Error updating cart');
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
      toast.success(
        'Cart cleared! Please sign in to manage your cart properly.'
      );
    }
  };

  const totalPrice =
    cart?.items?.reduce((total, item) => {
      const product =
        typeof item.product === 'string'
          ? productDetails[item.product]
          : item.product;
      return total + (product?.price || 0) * item.quantity;
    }, 0) || 0;

  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const SHIPPING_COST = 15.0;
  const total = subtotal + tax + SHIPPING_COST;
  return (
    <div className='container mx-auto py-10 px-4 lg:px-8'>
      <h1 className='text-3xl font-semibold mb-6 text-gray-800 dark:text-white'>
        Shopping Cart
      </h1>

      {cart?.items?.length ? (
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-8 space-y-6'>
            {cart?.items?.map((item) => {
              console.log('Cart item', item);
              const product =
                typeof item.product === 'string'
                  ? productDetails[item.product]
                  : item.product;

              return (
                <div
                  key={
                    typeof item.product === 'string'
                      ? item.product
                      : product?._id
                  }
                  className='flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='w-20 h-20 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700'>
                      {product?.images && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className='w-full h-full object-cover'
                        />
                      )}
                    </div>
                    <div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                        {product?.name || 'Loading...'}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Price: ${product?.price.toFixed(2)}
                      </p>
                      <div className='mt-2 flex items-center space-x-2'>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product as string,
                              item.quantity - 1
                            )
                          }
                          className='px-2 py-1 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded'
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <span className='text-gray-600 dark:text-gray-300'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product as string,
                              item.quantity + 1
                            )
                          }
                          className='px-2 py-1 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded'
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <p className='text-lg font-medium text-gray-800 dark:text-white'>
                      ${((product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.product as string)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <IoTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className='lg:col-span-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              Order Summary
            </h2>
            <div className='flex justify-between text-gray-700 dark:text-gray-300 mb-2'>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-gray-700 dark:text-gray-300 mb-2'>
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-gray-700 dark:text-gray-300 mb-4'>
              <span>Shipping</span>
              <span>${SHIPPING_COST.toFixed(2)}</span>
            </div>
            <hr className='my-4' />
            <div className='flex justify-between text-xl font-semibold text-gray-900 dark:text-white'>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {userInfo ? (
              <>
                <button
                  onClick={() => navigate('/checkout')}
                  className='w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors'
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleClearCart}
                  className='w-full mt-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors'
                >
                  Clear Cart
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    toast.error('Please sign in to proceed to checkout.')
                  }
                  className='w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors'
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleClearCart}
                  className='w-full mt-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors'
                >
                  Clear Cart
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
