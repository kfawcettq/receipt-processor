'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    shortDescription: {
        type: String,
        required: true,
        pattern: "^[\\w\\s\\-]+$",
        description: "The Short Product Description for the item"
    },
    price: {
        type: String,
        pattern: "^\\d+\\.\\d{2}$",
        description: "The total price payed for this item."
    }
});

module.exports = mongoose.model('Item', ItemSchema);