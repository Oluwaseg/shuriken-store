import { catchAsync } from "../utils/catchAsync.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const TAX_RATE = 0.1;
const SHIPPING_COST = 15;

export const createOrUpdateCart = catchAsync(async (req, res, next) => {
  const { userId, productId, quantity } = req.body;

  // Find the product by its ID
  const product = await Product.findById(productId);

  // Check if the product exists
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const price = product.price;
  const subtotal = price * quantity;
  const tax = subtotal * TAX_RATE;
  const shipping = SHIPPING_COST;
  const total = subtotal + tax + shipping;

  // Find or create the cart
  let cart = await Cart.findOne({ user: userId });
  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex >= 0) {
      // Update quantity and price of existing item
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = price;
    } else {
      // Add new item to the cart
      cart.items.push({ product: productId, quantity, price });
    }
    cart.tax = tax;
    cart.shipping = shipping;
    cart.total = total;
    await cart.save();
  } else {
    // Create a new cart if it doesn't exist
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, price }],
      tax,
      shipping,
      total,
    });
  }

  // Return success response with the updated or created cart
  res.status(200).json({
    success: true,
    cart,
  });
});



// 4. Other cart-related functionalities (Existing ones)
export const getCartByUserId = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate(
    "items.product"
  );

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

export const removeItemFromCart = catchAsync(async (req, res, next) => {
  const { userId, productId } = req.body;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.total = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

export const clearCart = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  const cart = await Cart.findOneAndDelete({ user: userId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});
