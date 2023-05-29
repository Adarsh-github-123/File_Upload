const express = require('express');
const app = express();
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user');


//middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));
app.use('/api/v1/user', userRoutes);

const PORT = 1338;

app.listen(PORT, ()=> {
    console.log('Server is running');
    connectDB();
})