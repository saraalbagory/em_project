const mongoose = require('mongoose');
const express = require('express');
const Restaurant = require('./models/restaurants.model.js');
const User = require('./models/user.model.js');
const Product = require('./models/product.models.js');
const { fetchAndSaveRestaurants } = require('./service/api_service'); // Ensure this path is correct
const cors = require('cors');
const ObjectId = mongoose.Types.ObjectId;


const app = express()

app.use(express.json())
app.use(cors());
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
            print("req,body",req.body)
            return res.status(400).json({ error: 'Request body is missing' });
        }
        const { name, email,gender,level,password } = req.body;
        let existingUser= await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
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

app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Sign in successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/search', async (req, res) => {
    const productName = req.query.product?.toLowerCase();
    console.log(`Received search request for product: "${productName}"`);

    try {
        if (!productName) {
            console.log('No product name provided');
            return res.status(400).json({ message: 'Product name is required' });
        }

        // Search for products by name (case-insensitive)
        const products = await Product.find({ name: new RegExp(productName, "i") });
        console.log('Products Found:', products);

        if (products.length === 0) {
            console.log('No products found for:', productName);
            return res.status(404).json({ message: 'No restaurants found for this product' });
        }

        // Extract restaurant IDs and convert to ObjectId
        const restaurantIds = products.map(p => p.restaurantId.toString());
        const validRestaurantIds = restaurantIds.map(id => new ObjectId(id));

        console.log('Valid Restaurant IDs:', validRestaurantIds);

        // Fetch restaurants by IDs
        const restaurants = await Restaurant.find({ _id: { $in: validRestaurantIds } });
        console.log('Found restaurants:', restaurants);

        res.json(restaurants);
    } catch (err) {
        console.error('Error in /api/search:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
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