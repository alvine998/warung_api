const mongoose = require('mongoose');

// Define product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    photo: { type: String, default: '' }, // URL to the photo
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Product', productSchema);
