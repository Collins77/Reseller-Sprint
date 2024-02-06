const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  partNumber: {
    type: String,
    required: [true, "Please enter your product part number!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  brand: {
    type: String,
    required: [true, "Please enter your product brand!"]
  },
  tags: {
    type: String,
  },
  warranty: {
    type: Number,
    required: [true, "Please enter product warranty period"]
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  isAvailable: {
    type: String,
    enum: ["available", "limited", "unavailable"],
    required: [true, "Please enter your product availability"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  // images: [
  //   {
  //     public_id: {
  //       type: String,
        
  //     },
  //     url: {
  //       type: String,
        
  //     },
  //   },
  // ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt:{
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
