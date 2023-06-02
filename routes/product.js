const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const {isAuthenticated, isSeller, isBuyer} = require('../middlewares/auth');
const { stripeKey } = require('../config/credentials');
const stripe = require('stripe')(stripeKey);

router.post("/create", isAuthenticated, isSeller, (req, res) => {
    upload(req, res, async (err) => {
        if(err) {
            console.log('coming in error',err);
            return res.status(500).send(err);
        }

        const { name, price } = req.body;
        if(!name || !price || !req.file) {
            return res.status(400).json({
                err: "we require all 3"
            })
        }
        
        if(Number.isNaN(price)){
            return res.status(400).json({
                err: "price should be number"
            })
        }
        
        let productDetails = {
            name, 
            price, 
            content: req.file.path
        }

        const savedProduct = await Product.create(productDetails);
        
        return res.status(200).json({
            status: 'ok',
            productDetails: savedProduct
        })
    })
});

router.get('/get/all', isAuthenticated, async (req, res) => {
    try{
        const products = await Product.findAll();
        return res.status(200).json({
            products
        })
    } catch (e) {
        res.status(500).json({err: e})
    }
});

router.post('/buy/:productID', isAuthenticated, isBuyer, async (req, res) => {
    try{
        const product = await product.findOnde({
            where: { id: req.params.productID}
        });
        if(!product){
            return res.status(404).json({ er: "No product found"})
        }

        const orderDetails = {
            productId,
            buyerId: req.user.id
        }

        let paymentMethod = await stripe.paymentMethod.create({
            type: "card",
            card: {
                number: "1234567812345678",
                exp_month: 9,
                exp_year: 2023,
                cvc: "314"
            }
        })
    } catch(e) {
        res.status(500).json({err: e})
    }
})

module.exports = router;

