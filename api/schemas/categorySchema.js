const mongoose = require('mongoose');

// Define category schema
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        remarks: { type: String, required: false },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Category', categorySchema);
