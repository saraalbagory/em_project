const mongoose = require('mongoose');

// id of the restaurant , name of the restaurant, lagitude, longitude
const restaurantSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, { timestamps: true, }, // Automatically add createdAt and updatedAt timestamps
    { collection: 'restaurants' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);


module.exports = Restaurant;
