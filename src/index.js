// Import required modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define a route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// MongoDB connection string
const mongoURI = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Define a simple Mongoose schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
