const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    STM_eligible: String,
    category_1: String,
    category_2: String,
    category_3: String,
    event: String,
    item: String,
    location: String,
    price_1: Number,
    price_2: Number,
    price_3: Number,
    section: String,
});

module.exports = mongoose.model('Menu', MenuSchema);