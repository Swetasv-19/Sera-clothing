const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
      "name images price discountPrice stock isActive isFeatured",
    );

    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    if (!productId) {
      return next(new ErrorResponse("Product ID is required", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    // Use discountPrice if available, else regular price
    const itemPrice = product.discountPrice || product.price;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        userId: req.user.id,
        items: [
          {
            productId,
            quantity,
            variant,
            price: itemPrice,
          },
        ],
      });
    } else {
      // Check if item already exists in cart with same variant
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId && item.variant === variant,
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // New item, push to items array
        cart.items.push({
          productId,
          quantity,
          variant,
          price: itemPrice,
        });
      }
      await cart.save();
    }

    cart = await cart.populate(
      "items.productId",
      "name images price discountPrice stock isActive isFeatured",
    );

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params; // Using the subdocument _id for the cart item

    if (quantity < 1) {
      return next(new ErrorResponse("Quantity must be at least 1", 400));
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404));
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return next(new ErrorResponse("Item not found in cart", 404));
    }

    item.quantity = quantity;
    await cart.save();

    await cart.populate(
      "items.productId",
      "name images price discountPrice stock isActive isFeatured",
    );

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404));
    }

    cart.items.pull({ _id: itemId });
    await cart.save();

    await cart.populate(
      "items.productId",
      "name images price discountPrice stock isActive isFeatured",
    );

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
