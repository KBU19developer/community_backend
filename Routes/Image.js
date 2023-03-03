const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DateNow = require('../API/time.js');
const v4 = require('uuid');
const Hashing = require('../API/encryt.js');

const storage = multer.diskStorage({destination: (req,file,cb) => { cb(null, path.join(__dirname, '../downloadIMG/')) }, filename: (req, file, cb) => { 
    cb(null, file.fieldname + '-' + DateNow.Time)
 }}); // locate directory for downloading imagefile and assigned file name

 const upload = multer({ storage: storage }); // ready to downloading file

router.post('/', upload.single('ImgFile'), function(req,res){ // when receieved image file
    console.log(req.file);
    console.log(req.file.filename);
    res.send({'response' : 'ok', 'UUID' : v4(), 'path' : Hashing.Hash(storage)});
});

//test html render 
router.get('/', (req, res, next) => {
	res.render('AI_test.html');
})

module.exports = router;
