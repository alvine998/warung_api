const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    getProductStockHistory,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Product CRUD routes
router.get('/', authMiddleware, getProducts); // Get all products
router.get('/:id', authMiddleware, getProductById); // Get a product by ID
router.post('/', authMiddleware, createProduct); // Create a new product
router.put('/:id', authMiddleware, updateProduct); // Update a product by ID
router.delete('/:id', authMiddleware, deleteProduct); // Delete a product by ID
router.post('/update-stock', authMiddleware, updateProductStock); // Update stock a product by ID
router.get('/stock/history', authMiddleware, getProductStockHistory); // Get all product histories

module.exports = router;
