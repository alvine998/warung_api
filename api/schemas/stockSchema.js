const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productCode: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    previousStock: {
        type: Number,
        required: true,
    },
    stockAdded: {
        type: Number,
        required: true,
    },
    currentStock: {
        type: Number,
        required: true,
    },
}, { timestamps: true } // Automatically adds createdAt and updatedAt
);

const StockHistory = mongoose.model('StockHistory', stockHistorySchema);

module.exports = StockHistory;
