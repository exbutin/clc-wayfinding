const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
    name: String,
    section: String,
    category: String,
    level: String,
    coordinates: [Number],
    active_image: String,
    inactive_image: String
});

module.exports = mongoose.model('Pin', PinSchema);