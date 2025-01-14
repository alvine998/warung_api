const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

// Product CRUD routes
router.get('/', authMiddleware, getCategories); // Get all products
router.get('/:id', authMiddleware, getCategoryById); // Get a product by ID
router.post('/', authMiddleware, createCategory); // Create a new product
router.put('/:id', authMiddleware, updateCategory); // Update a product by ID
router.delete('/:id', authMiddleware, deleteCategory); // Delete a product by ID

module.exports = router;
