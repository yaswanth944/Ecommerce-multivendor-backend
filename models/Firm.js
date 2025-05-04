const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true 
    },
    category: {
        type: [String],
        enum: ['veg', 'non-veg'] // 🔹 Fixed "non veg" → "non-veg"
    },
    region: {
        type: [String],
        enum: ['south-indian', 'north-indian', 'bakery'] // 🔹 Fixed enum hyphenation
    },
    offer: {
        type: String
    },
    image: {
        type: String
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor' // 🔹 Fixed ref (capitalized "Vendor")
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]
});

const Firm = mongoose.model("Firm", firmSchema);
module.exports = Firm;
