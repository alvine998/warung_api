const User = require('../schemas/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Get all users
exports.getUsers = async (req, res) => {
    try {
        // Get filter values from query parameters
        const { name, email, phone, page = 1, limit = 10 } = req.query;

        // Build the filter object
        let filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
        if (email) filter.email = { $regex: email, $options: 'i' }; // Case-insensitive search for email
        if (phone) filter.phone = { $regex: phone, $options: 'i' }; // Case-insensitive search for phone

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Find users with pagination
        const users = await User.find(filter).select('-password')
            .skip(skip)
            .limit(limit);

        // Get total count of users to calculate the total number of pages
        const totalCount = await User.countDocuments(filter);

        // Send paginated response
        res.status(200).json({
            users,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            pageSize: limit,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }


};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const newUser = new User({ name, phone, email, password });
        const savedUser = await newUser.save();
        res.status(201).json({ ...savedUser._doc, password: undefined }); // Exclude password in response
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        }).select('-password'); // Exclude password in response
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Login a user by email or phone
exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // `identifier` can be email or phone
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Identifier and password are required' });
        }

        // Find user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Issue JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with user data and token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { ...user._doc, password: undefined }, // Exclude password from response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
