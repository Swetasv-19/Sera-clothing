const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate('productId')
      .sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return next(new ErrorResponse('Product ID is required', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const existingItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    if (existingItem) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId
    });

    await wishlistItem.populate('productId');

    res.status(201).json({
      success: true,
      data: wishlistItem
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      productId
    });

    if (!wishlistItem) {
      return next(new ErrorResponse('Item not found in wishlist', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};
