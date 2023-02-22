//필수 모듈
const express = require('express');
const cors = require('cors');

//라우터 
const index = require('./Routes/index');
const signup = require('./Routes/Account');
const uploadImg = require('./Routes/Image');
const Board = require('./Routes/BoardInfo');


const app = express();

const port = 3001; // This is the port number
app.use(cors()); // for interacting frontend using API
app.use(express.json()); // for using POST
app.use(express.urlencoded({ extended : false })); // for using POST

app.use('/', index); // index page
app.use('/Account', signup); // sign up page
app.use('/IMG', uploadImg); // AI image upload page
app.use('/Board', Board);
app.use('*', index); // when search using URL

app.listen(port, () => {
    console.log(`The server Runing at ${port}`); // Be shown on the CLI when server running 
}); // The server Listens on recieved port
