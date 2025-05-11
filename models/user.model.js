const mongoose = require('mongoose');


//name , email, gender, level,password
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: false
    },
    level: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,

    }, // Automatically add createdAt and updatedAt timestamps
    {
        collection: 'users'
    });


const User = mongoose.model('User', userSchema);

module.exports = User;
