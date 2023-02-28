const express = require('express');
const router = express.Router();
const path = require('path');
const { traceDeprecation } = require('process');

router.use(express.static(path.join(__dirname, '../../frontend/build'))); // To use Static file in this path

router.get('http://localhost:3001/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build')); // send index html file
});

module.exports = router; // to use this out of this file