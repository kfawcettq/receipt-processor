'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receiptSchema = new Schema({
    retailer: {
        type: String,
        pattern: "^[\\w\\s\\-&]+$",
        required: true,
        description: "The name of the retailer or store the receipt is from."
    },
    purchaseDate: {
        type: String,
        required: true,
        description: "The date of the purchase printed on the receipt."
    },
    purchaseTime: {
        type: String,
        required: true,
        description: "The time of the purchase printed on the receipt. 24-hour time expected."
    },
    total: {
        type: Number,
        pattern: "^\\d+\\.\\d{2}$",
        required: true,
        description: "The total amount paid on the receipt."
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Item',
        required: true,
    },
    points: {
        type: String,
        default: "0"
    }
});

module.exports = mongoose.model('Receipt', receiptSchema);