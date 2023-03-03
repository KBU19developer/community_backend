const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');



//html render 
router.get('/', (req, res, next) => {
	res.render('aiPage.html');
})



module.exports = router;