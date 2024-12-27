import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
import ScrollArea from '../ui/ScrollArea';

const CartModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  // Existing state and hooks remain unchanged
  const [productDetails, setProductDetails] = useState<{
    [key: string]: Product | undefined;
  }>({});
  const cart = useAppSelector((state) => state.cart.cart);
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // All existing useEffects and handlers remain unchanged
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

  const totalPrice = cart?.items?.reduce((total, item) => {
    const product =
      typeof item.product === 'string'
        ? productDetails[item.product]
        : item.product;
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-end z-50'
        >
          <motion.div
            ref={modalRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='h-full w-full sm:w-[28rem] bg-body-light dark:bg-body-dark shadow-2xl flex flex-col'
          >
            {/* Header */}
            <div className='p-4 border-b border-border-light dark:border-border-dark bg-white/50 dark:bg-dark-light/50 backdrop-blur-md'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <ShoppingCart className='w-5 h-5 text-accent-light dark:text-accent-dark' />
                  <h2 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                    Shopping Cart
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
                >
                  <X className='w-5 h-5 text-text-primary-light dark:text-text-primary-dark' />
                </button>
              </div>
              <p className='mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                {cart?.items?.length || 0} items in your cart
              </p>
            </div>

            {/* Cart Items */}
            <ScrollArea className='flex-1 overflow-y-auto'>
              {cart && cart.items && cart.items.length > 0 ? (
                <motion.ul
                  initial='hidden'
                  animate='visible'
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className='divide-y divide-border-light dark:divide-border-dark'
                >
                  {cart.items.map((item) => {
                    const product =
                      typeof item.product === 'string'
                        ? productDetails[item.product]
                        : item.product;
                    return (
                      <motion.li
                        key={
                          product
                            ? String(product._id || item.product)
                            : String(item.product)
                        }
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className='p-4 flex gap-4'
                      >
                        {/* Product Image */}
                        <div className='relative w-20 h-20 rounded-lg overflow-hidden bg-input-light dark:bg-input-dark'>
                          {product?.images ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <Loader2 className='w-6 h-6 animate-spin text-text-secondary-light dark:text-text-secondary-dark' />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className='flex-1 min-w-0 flex flex-col justify-between'>
                          <div>
                            <h3 className='font-medium text-text-primary-light dark:text-text-primary-dark truncate'>
                              {product ? product.name : 'Loading...'}
                            </h3>
                            <p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
                              ₦
                              {product
                                ? formatPrice(product.price || 0)
                                : '-.--'}{' '}
                              each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex items-center justify-between mt-2'>
                            <div className='flex items-center gap-1'>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product as string,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors'
                              >
                                <Minus className='w-4 h-4' />
                              </button>
                              <span className='w-8 text-center text-sm font-medium'>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product as string,
                                    item.quantity + 1
                                  )
                                }
                                className='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                              >
                                <Plus className='w-4 h-4' />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.product as string)
                              }
                              className='p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className='text-right'>
                          <p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
                            ₦
                            {product
                              ? formatPrice(
                                  (product.price || 0) * item.quantity
                                )
                              : '-.--'}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='h-full flex flex-col items-center justify-center p-8 text-center'
                >
                  <ShoppingCart className='w-16 h-16 text-text-secondary-light dark:text-text-secondary-dark opacity-20' />
                  <p className='mt-4 text-text-primary-light dark:text-text-primary-dark font-medium'>
                    Your cart is empty
                  </p>
                  <p className='mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                    Add items to your cart to see them here
                  </p>
                </motion.div>
              )}
            </ScrollArea>

            {/* Footer */}
            {(cart?.items?.length ?? 0) > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='border-t border-border-light dark:border-border-dark bg-white/50 dark:bg-dark-light/50 backdrop-blur-md'
              >
                {/* Summary */}
                <div className='p-4 space-y-4'>
                  <div className='flex items-center justify-between text-text-primary-light dark:text-text-primary-dark'>
                    <span className='font-medium'>Total</span>
                    <span className='text-lg font-semibold'>
                      ₦{formatPrice(totalPrice || 0)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className='grid grid-cols-2 gap-3'>
                    <button
                      onClick={handleClearCart}
                      className='px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleViewAll}
                      className='px-4 py-2 text-sm font-medium text-white bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark rounded-lg transition-colors'
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
