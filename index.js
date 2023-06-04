const express = require('express');
const app = express();
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

require('dotenv').config();

//middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
//const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT;

const spec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Photo Store API",
            version: "1.0.0",
            description: "Buy/Sell photos"
        },
        servers: [
            {
                url: process.env.BASE_URL
            }
        ]
    },
    apis: ["./routes/*.js"]
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);


app.listen(PORT, ()=> {
    console.log('Server is running');
    connectDB();
})