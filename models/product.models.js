const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}
);
module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');