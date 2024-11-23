import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a subcategory name"],
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

subcategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

subcategorySchema.set("toJSON", {
  virtuals: true,
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;
