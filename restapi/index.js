const express = require('express'),
  bodyParser = require('body-parser'),
  restApi = require('./api');

const router = express.Router();

// minden testtel ellátott API hívás
// JSON-t tartalmaz
router.use(bodyParser.json());

// API endpointok a megfelelő alrouterbe
router.use('/tantargyak', restApi);

module.exports = router;
