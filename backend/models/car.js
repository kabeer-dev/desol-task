const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    price: {
        type: String,
        default: 'test'
    },
    phone: {
        type: String,
    },
    country: {
        type: String,
    },
    noOfCopies: {
        type: String,
    },
    images: {
        type: Array,
    },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
