import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

  // Existing useEffects and handlers remain unchanged
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
  const SHIPPING_COST = 8500;
  const total = subtotal + tax + SHIPPING_COST;

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='min-h-screen bg-primary dark:bg-body-dark'>
      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl font-bold mb-8 text-text-primary-light dark:text-text-primary-dark'>
          Your Shopping Cart
        </h1>

        {cart?.items?.length ? (
          <div className='grid lg:grid-cols-12 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-8 space-y-6'>
              <AnimatePresence>
                {cart?.items?.map((item) => {
                  const product =
                    typeof item.product === 'string'
                      ? productDetails[item.product]
                      : item.product;

                  return (
                    <motion.div
                      key={
                        typeof item.product === 'string'
                          ? item.product
                          : product?._id
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className='bg-body-light dark:bg-dark-light rounded-lg shadow-md overflow-hidden'
                    >
                      <div className='p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6'>
                        <div className='w-24 h-24 rounded-md overflow-hidden bg-input-light dark:bg-input-dark flex-shrink-0'>
                          {product?.images && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className='w-full h-full object-cover'
                            />
                          )}
                        </div>
                        <div className='flex-grow'>
                          <h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                            {product?.name || 'Loading...'}
                          </h3>
                          <p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
                            Price: ₦{' '}
                            {product?.price !== undefined
                              ? formatPrice(Math.round(product.price))
                              : 'N/A'}
                          </p>
                          <div className='mt-4 flex items-center space-x-4'>
                            <div className='flex items-center space-x-2'>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product as string,
                                    item.quantity - 1
                                  )
                                }
                                className='p-1 rounded-full bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark hover:bg-accent-light hover:text-white dark:hover:bg-accent-dark transition-colors'
                                disabled={item.quantity === 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className='text-text-primary-light dark:text-text-primary-dark font-medium'>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product as string,
                                    item.quantity + 1
                                  )
                                }
                                className='p-1 rounded-full bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark hover:bg-accent-light hover:text-white dark:hover:bg-accent-dark transition-colors'
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.product as string)
                              }
                              className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors'
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                            ₦
                            {formatPrice((product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className='lg:col-span-4'>
              <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-md p-6 sticky top-6'>
                <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6'>
                  Order Summary
                </h2>
                <div className='space-y-4'>
                  <div className='flex justify-between text-text-secondary-light dark:text-text-secondary-dark'>
                    <span>Subtotal</span>
                    <span>₦{formatPrice(subtotal)}</span>
                  </div>
                  <div className='flex justify-between text-text-secondary-light dark:text-text-secondary-dark'>
                    <span>Tax (10%)</span>
                    <span>₦{formatPrice(tax)}</span>
                  </div>
                  <div className='flex justify-between text-text-secondary-light dark:text-text-secondary-dark'>
                    <span>Shipping</span>
                    <span>₦{formatPrice(SHIPPING_COST)}</span>
                  </div>
                  <div className='border-t border-border-light dark:border-border-dark pt-4'>
                    <div className='flex justify-between text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
                      <span>Total</span>
                      <span>₦{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                <div className='mt-8 space-y-4'>
                  {userInfo ? (
                    <button
                      onClick={() => navigate('/checkout')}
                      className='w-full py-3 px-4 bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out'
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        toast.error('Please sign in to proceed to checkout.')
                      }
                      className='w-full py-3 px-4 bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out'
                    >
                      Sign In to Checkout
                    </button>
                  )}
                  <button
                    onClick={handleClearCart}
                    className='w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out'
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-16'
          >
            <ShoppingCart
              size={64}
              className='mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-6'
            />
            <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2'>
              Your cart is empty
            </h2>
            <p className='text-text-secondary-light dark:text-text-secondary-dark mb-8'>
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className='px-6 py-3 bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out'
            >
              Continue Shopping
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
