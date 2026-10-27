import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 10, min: 0 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    sku: { type: String, default: "" },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, category: 1, featured: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
