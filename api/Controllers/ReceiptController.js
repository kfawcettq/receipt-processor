'use strict';
var Receipt = require('../Models/ReceiptModel');
var Item = require('../Models/ItemModel');
const Utils = require("../Utils/Utils");
const ResponseParams = require("../Config/ResponseParams");

const AlphaNumericTest = /^[a-z0-9]$/i;

module.exports = {

  processNew: async (req, res, next) => {
    if (!isValidReceipt(req.body)) {
      return Utils.HttpResponse.generateServerResponse(res, ResponseParams.BAD_REQUEST);
    }

    var newReceipt = new Receipt({ ...req.body, items: [] });
    var newItems = [];

    for (let i = 0; i < req.body.items.length; i++) {
      var newItem = new Item({ ...req.body.items[i] });

      //Checking for existing product in the DB
      var storedItem = await Item.findOne({ shortDescription: newItem.shortDescription });

      //If not existing, storing in DB
      if (Utils.Validation.isElementNull(storedItem)) {
        storedItem = await newItem.save()
          .catch(error => {
            console.log("error while saving item", error);
          })
      }

      //Adding items to receipt
      newItems.push(storedItem.id);
    }

    newReceipt.items = newItems;
    await newReceipt.save()
      .then(createdReceipt => {
        return Utils.HttpResponse.generateServerResponse(res, ResponseParams.SUCCESS, { id: createdReceipt._id });
      })
      .catch(error => {
        console.log("Error produced when creating receipt.", error);
        return Utils.HttpResponse.generateServerResponse(res, ResponseParams.BAD_REQUEST);
      });


  },

  getNumberOfPoints: async (req, res, next) => {
    var foundReceipt = await Receipt.findById(req.params.id).populate('items')
      .then(foundReceipt => {
        return foundReceipt;
      })
      .catch(error => {
        console.log(`Error produced when looking for receipt with ID: ${req.params.id}`, error);
      });

    if (Utils.Validation.isElementNull(foundReceipt)) {
      return Utils.HttpResponse.generateServerResponse(res, ResponseParams.NOT_FOUND);
    } else {

      //Setting a retry logic in case of errors
      let attempts = 3;
      while (foundReceipt.points === "0" && attempts > 0) {
        foundReceipt = await calculateNumberOfPoints(foundReceipt);
        attempts--;
      }

      return Utils.HttpResponse.generateServerResponse(res, ResponseParams.SUCCESS, { points: foundReceipt.points });
    }
  }

}

function isValidReceipt(receipt) {
  // First check for empty receipt body - Second to check empty list of items
  return !Utils.Validation.isElementNull(receipt) && !Utils.Validation.isElementNull(receipt.items);
}

async function calculateNumberOfPoints(receipt) {
  console.log("Calculating points for: ", receipt);
  var points = 0;

  //One point for every alphanumeric character in the retailer name.
  for (let character of receipt.retailer) {
    if (AlphaNumericTest.test(character)) {
      points++;
    }
  }

  // 50 points if the total is a round dollar amount with no cents.
  if (receipt.total === Math.trunc(receipt.total)) {
    points += 50;
  }

  // 25 points if the total is a multiple of `0.25`.
  if (receipt.total % 0.25 === 0) {
    points += 25;
  }

  // 5 points for every two items on the receipt.
  points += 5 * Math.trunc(receipt.items.length / 2);

  // If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. 
  receipt.items.forEach(item => {
    if (item.shortDescription.trim().length % 3 === 0) {
      points += Math.ceil(item.price * 0.2);
    }
  });


  //Storing in DB to speed up next search
  receipt = await Receipt.findByIdAndUpdate(receipt.id, { points }, { new: true })
    .then(updatedReceipt => {
      console.log("Updated receipt:  ", updatedReceipt.id, " - ", updatedReceipt.points);
      return updatedReceipt;
    })
    .catch(error => {
      setTimeout(function () {
        console.log("Error calculating points for ", receipt.id, error);
      }, 2000);
    });

  return receipt;
}
