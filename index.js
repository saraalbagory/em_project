const mongoose = require('mongoose');
const express = require('express');
const Restaurant = require('./models/restaurants.model.js');
const User = require('./models/user.model.js');
const Product = require('./models/product.models.js');
const { fetchAndSaveRestaurants } = require('./service/api_service'); // Ensure this path is correct

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    //this is the response
    res.send('Hello World!')
})

app.get('/import', async (req, res) => {
    try {
        const count = await fetchAndSaveRestaurants();
        res.status(200).json({ message: `${count} restaurants imported.` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch or save restaurants', details: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try{
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        const { name, email,gender,level,password } = req.body;
        let existingUser= await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({ name,email,gender,level,password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//add product to DB 
app.post('/api/restaurants/:id/products', async (req, res) => {
    try {
        const { name } = req.body;
        const restaurantId = req.params.id;

        const product = new Product({ name, restaurantId });
        await product.save();

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get products by restaurant ID
app.get('/api/restaurants/:id/products', async (req, res) => {
    try {
        const products = await Product.find({ restaurantId: req.params.id });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

mongoose.connect('mongodb+srv://saraelbagory:20210156Sa@cluster0.bfg0w9g.mongodb.net/Em-APi?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('Connected to MongoDB')
    app.listen(3000, () => {
        console.log('Server is running on port 3000 updated 2')
    })
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});