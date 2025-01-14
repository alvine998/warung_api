const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require('../controllers/userController');

const router = express.Router();

// User CRUD routes
router.get('/', getUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.post('/', createUser); // Create a new user
router.put('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID
router.post('/login', loginUser); // Login a user

module.exports = router;
