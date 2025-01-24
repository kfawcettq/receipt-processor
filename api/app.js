'use strict';
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
const DataBaseUtils = require("./Utils/DataBase.js");


var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit: '260mb', extended: true }));
app.use(bodyParser.json({ limit: '250mb' }));

// Database Connection
DataBaseUtils.createConnection();

// Receipt Processor
var ReceiptRoutes = require('./Routes/ReceiptRoutes.js');

// Endpoints - Routes
app.use('/receipts', ReceiptRoutes);

module.exports = app;
