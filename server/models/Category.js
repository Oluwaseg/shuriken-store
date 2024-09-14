import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    maxlength: [100, "Category name should not exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description should not exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
