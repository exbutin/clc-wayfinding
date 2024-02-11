const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
    name: String,
    title: String,
    url: String,
    coordinates: [[Number]],
});

module.exports = mongoose.model('Level', LevelSchema);