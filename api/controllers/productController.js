const Product = require('../schemas/productSchema');

// Get all products with pagination
exports.getProducts = async (req, res) => {
    try {
        // Get filter values from query parameters
        const { name, code, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        // Build the filter object
        let filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
        if (code) filter.code = { $regex: code, $options: 'i' }; // Case-insensitive search for code
        if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) }; // Minimum price
        if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) }; // Maximum price

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Find products with pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit);

        // Get total count of products to calculate the total number of pages
        const totalCount = await Product.countDocuments(filter);

        // Send paginated response
        res.status(200).json({
            products,
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

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, code, stock, price, photo, categoryId, categoryName } = req.body;
        const newProduct = new Product({ name, code, stock, price, photo, categoryId, categoryName });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
