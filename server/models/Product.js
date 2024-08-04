import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    default: 0,
  },
  reviews: [reviewSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, "Count in stock is required"],
    default: 1,
  },
  images: [
    {
      url: { type: String, required: [true, "Image URL is required"] },
      public_id: {
        type: String,
        required: [true, "Image public ID is required"],
      },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: String,
    // required: [true, "Brand is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
