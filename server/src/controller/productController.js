const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all products  (with filtering, sorting, pagination & search)
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      isFeatured,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category.toLowerCase();
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (sizes) {
      const sizeArr = sizes.split(',').map((s) => s.trim());
      filter.sizes = { $in: sizeArr };
    }

    if (colors) {
      const colorArr = colors.split(',').map((c) => c.trim());
      filter.colors = { $in: colorArr };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { category: category.toLowerCase(), isActive: true };

    const [products, total] = await Promise.all([
      Product.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a product   (Admin only) - JSON body (legacy)
// @route   POST /api/products
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Admin create product with images (Cloudinary + multipart/form-data)
// @route   POST /api/admin/products
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
exports.adminCreateProductWithImages = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      discountPrice,
      subCategory,
      sizes,
      colors,
      sku,
      brand,
      tags,
      isFeatured
    } = req.body;

    const files = req.files || [];
    const imageUrls = files.map((file) => file.path).filter(Boolean);

    // Coerce types from multipart/form-data (strings) into proper types
    const toNumber = (value) => {
      if (value === undefined || value === null || value === '') return undefined;
      const num = Number(value);
      return Number.isNaN(num) ? undefined : num;
    };

    const toBoolean = (value) => {
      if (typeof value === 'boolean') return value;
      if (value === undefined || value === null) return undefined;
      const val = String(value).toLowerCase();
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    };

    const toArrayFromCSV = (value) => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value;
      return String(value)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    };

    const productData = {
      name,
      description,
      price: toNumber(price),
      category,
      stock: toNumber(stock),
      discountPrice: toNumber(discountPrice),
      subCategory,
      sku,
      brand,
      isFeatured: toBoolean(isFeatured),
      // Optional arrays
      sizes: toArrayFromCSV(sizes),
      colors: toArrayFromCSV(colors),
      tags: toArrayFromCSV(tags)
    };

    if (imageUrls.length) {
      productData.images = imageUrls;
    }

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a product   (Admin only)
// @route   PUT /api/products/:id
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a product   (Admin only — soft delete)
// @route   DELETE /api/products/:id
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));
    }

    // Soft delete — keeps DB record but hides from public queries
    product.isActive = false;
    await product.save();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
