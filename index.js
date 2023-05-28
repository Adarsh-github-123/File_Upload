const express = require('express');
const app = express();
const { connectDB } = require('./config/db');



//middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extends : false }));

const PORT = 1337;

app.listen(PORT, ()=> {
    console.log('Server is running');
    connectDB();
})