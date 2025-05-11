const axios = require('axios');
const Restaurant = require('../models/restaurants.model.js');


// const apiKey = process.env.TOMTOM_API_KEY;
// const lat = 30.0444;
// const lon = 31.2357;

const fetchAndSaveRestaurants = async () => {
    const url ="https://api.tomtom.com/search/2/nearbySearch.json?lat=30.0444&lon=31.2357&categorySet=7315,7316&key=kP3iP5VI8ip2A7i1CVL3s3YrpqK2fG6X";

    const response = await axios.get(url);
    const results = response.data.results;

    for (const item of results) {
        const restaurantData = {
            id: item.id,
            name: item.poi.name,
            latitude: item.position.lat,
            longitude: item.position.lon,
        };

        await Restaurant.updateOne(
            { id: restaurantData.id },
            { $set: restaurantData },
            { upsert: true }
        );
    }

    return results.length;
};

module.exports = { fetchAndSaveRestaurants };
