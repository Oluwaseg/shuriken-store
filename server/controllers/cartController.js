import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createOrUpdateCart = catchAsync(async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'User ID, Product ID, and Quantity are required.',
      });
    }

    // Validate the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const TAX_RATE = 0.1;
    const SHIPPING_COST = 15;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const price = product.price;
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = price;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price }],
      });
    }

    cart.subtotal = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const tax = cart.subtotal * TAX_RATE;
    const shipping = SHIPPING_COST;

    cart.total = cart.subtotal + tax + shipping;
    cart.tax = tax;
    cart.shipping = shipping;

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Error creating/updating cart:', error.message);
    next(new ErrorHandler('Failed to create or update cart', 500));
  }
});

export const getCartByUserId = catchAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name price images',
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    next(new ErrorHandler('Failed to fetch cart', 500));
  }
});

export const removeItemFromCart = catchAsync(async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Product ID are required',
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const productIdToRemove =
      typeof productId === 'object' ? productId._id : productId;

    // Filter out the item to be removed
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productIdToRemove
    );

    if (cart.items.length === 0) {
      // Reset tax, shipping, and totals if the cart is empty
      cart.tax = 0;
      cart.shipping = 0;
      cart.total = 0;
      cart.subtotal = 0;
    } else {
      // Recalculate totals if the cart still has items
      cart.subtotal = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const TAX_RATE = 0.1;
      const SHIPPING_COST = 15;

      cart.tax = cart.subtotal * TAX_RATE;
      cart.shipping = SHIPPING_COST;
      cart.total = cart.subtotal + cart.tax + cart.shipping;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    next(new ErrorHandler('Failed to remove item from cart', 500));
  }
});

export const clearCart = catchAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    next(new ErrorHandler('Failed to clear cart', 500));
  }
});

export const mergeCart = async (req, res) => {
  const { guestCart, userId } = req.body;
  const TAX_RATE = 0.1;
  const SHIPPING_COST = 15;

  try {
    // Fetch the logged-in user's cart
    let userCart = await Cart.findOne({ user: userId });

    // Create a new cart for the user if one doesn't exist
    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    for (const guestItem of guestCart) {
      const existingItem = userCart.items.find(
        (item) => item.product.toString() === guestItem.product
      );

      // Find the product to check available stock
      const product = await Product.findById(guestItem.product);

      if (product) {
        if (existingItem) {
          // Check if the new quantity does not exceed available stock
          const newQuantity = existingItem.quantity + guestItem.quantity;
          if (newQuantity <= product.stock) {
            existingItem.quantity = newQuantity;
          } else {
            existingItem.quantity = product.stock;
          }
        } else {
          // Check if adding the guest item does not exceed available stock
          if (guestItem.quantity <= product.stock) {
            userCart.items.push(guestItem);
          } else {
            userCart.items.push({ ...guestItem, quantity: product.stock });
          }
        }
      }
    }

    // Calculate the subtotal
    userCart.subtotal = userCart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calculate tax and shipping
    const tax = userCart.subtotal * TAX_RATE;
    const shipping = SHIPPING_COST;

    // Calculate the total and update the cart
    userCart.total = userCart.subtotal + tax + shipping;
    userCart.tax = tax;
    userCart.shipping = shipping;

    // Save the updated cart
    await userCart.save();

    res.status(200).json({
      success: true,
      cart: userCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error merging cart',
    });
  }
};
