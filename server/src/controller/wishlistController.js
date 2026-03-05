const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate('productId')
      .sort({ addedAt: -1 });

    // Transform the data to include product details
    const wishlistItems = wishlist.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      discountPrice: item.productId.discountPrice,
      images: item.productId.images,
      category: item.productId.category,
      brand: item.productId.brand,
      inStock: item.productId.stock > 0,
      addedAt: item.addedAt
    }));

    res.status(200).json({
      success: true,
      data: wishlistItems,
      count: wishlistItems.length
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

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    if (existingItem) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId
    });

    await wishlistItem.populate('productId');

    // Return formatted response
    res.status(201).json({
      success: true,
      data: {
        _id: wishlistItem._id,
        productId: wishlistItem.productId._id,
        name: wishlistItem.productId.name,
        price: wishlistItem.productId.price,
        discountPrice: wishlistItem.productId.discountPrice,
        images: wishlistItem.productId.images,
        category: wishlistItem.productId.category,
        brand: wishlistItem.productId.brand,
        inStock: wishlistItem.productId.stock > 0,
        addedAt: wishlistItem.addedAt
      },
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return next(new ErrorResponse('Product ID is required', 400));
    }

    const wishlistItem = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      productId
    });

    if (!wishlistItem) {
      return next(new ErrorResponse('Item not found in wishlist', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.clearWishlist = async (req, res, next) => {
  try {
    const result = await Wishlist.deleteMany({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

exports.checkWishlistStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return next(new ErrorResponse('Product ID is required', 400));
    }

    const wishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    res.status(200).json({
      success: true,
      data: {
        isInWishlist: !!wishlistItem,
        addedAt: wishlistItem ? wishlistItem.addedAt : null
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.moveWishlistToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return next(new ErrorResponse('Product ID is required', 400));
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if in wishlist
    const wishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    if (!wishlistItem) {
      return next(new ErrorResponse('Product not found in wishlist', 404));
    }

    // Remove from wishlist
    await Wishlist.findOneAndDelete({
      userId: req.user.id,
      productId
    });

    // Return product info for cart addition
    res.status(200).json({
      success: true,
      data: {
        productId: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        images: product.images,
        message: 'Product moved from wishlist to cart'
      }
    });
  } catch (error) {
    next(error);
  }
};
