'use strict';
const router = require('express-promise-router')();
const ReceiptController = require('../Controllers/ReceiptController');

router.route("/process")
  .post(ReceiptController.processNew);

router.route("/:id/points")
  .get(ReceiptController.getNumberOfPoints);

module.exports = router;