const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
      maxlength: [120, "Name cannot be more than 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price must be a positive number"],
    },
    discountPrice: {
      type: Number,
      default: null,
      min: [0, "Discount price must be a positive number"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["men", "women", "kids", "accessories", "sale"],
      lowercase: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple docs with null sku
    },
    brand: {
      type: String,
      trim: true,
      default: "Sera",
    },
    tags: {
      type: [String],
      default: [],
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCustomisable: {
      type: Boolean,
      default: false,
    },
    customisationPrice: {
      type: Number,
      default: null,
      min: [0, "Customisation price must be a positive number"],
    },
  },
  {
    timestamps: true,
  },
);

// Text index for search
productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
