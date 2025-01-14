const Category = require('../schemas/categorySchema');

// Get all category with pagination
exports.getCategories = async (req, res) => {
    try {
        // Get filter values from query parameters
        const { name, code, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        // Build the filter object
        let filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Find categories with pagination
        const categories = await Category.find(filter)
            .skip(skip)
            .limit(limit);

        // Get total count of categories to calculate the total number of pages
        const totalCount = await Category.countDocuments(filter);

        // Send paginated response
        res.status(200).json({
            categories,
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

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, remarks } = req.body;
        const newCategory = new Category({ name, remarks });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
