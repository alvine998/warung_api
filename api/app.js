const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');


require('dotenv').config();

const app = express();
const port = 4000;

const corsOptions = {
    origin: '*', // Replace with your frontend's URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(helmet()); // Add helmet to secure HTTP headers
app.use(cors(corsOptions));

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI; // Replace with your MongoDB URI

// Connect to MongoDB

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('CORS-enabled Express server!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
