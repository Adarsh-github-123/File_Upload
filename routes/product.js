const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const {isAuthenticated, isSeller, isBuyer} = require('../middlewares/auth');
const { stripeKey } = require('../config/credentials');
const Order = require("../models/orderModel");
const stripe = require('stripe')(stripeKey);
const { WebhookClient } = require("discord.js");

const webhook = new WebhookClient({
    url: "" //Enter the url of the discord channel
})


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

router.post('/buy/:productId', isAuthenticated, isBuyer, async (req, res) => {
    try{
        const productFind = await product.findOnde({
            where: { id: req.params.productId}
        })?.dataValues;

        const product = productFind.dataValues

        if(!product){
            return res.status(404).json({ er: "No product found"})
        }

        const orderDetails = {
            productId: req.params.productId,
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
        });

        let paymentIntent = await stripe.paymentIntent.create({
            amount: product.price,
            currency: "inr",
            payment_method_types: ["card"],
            payment_method: paymentMethod.id,
            confirm: true
        });

        if(paymentIntent) {
            const createOrder = await Order.create(orderDetails);

            webhook.send({
                content: `This is my message just to check whether it is connected with discord or not for order id: ${createOrder.id}`,
                username: "order-keeper",
                avatarURL: "https://i.imgur.com/AfFp7pu.png",
            })
            return res.status(200).json({
                createOrder
            });
        } else {
            return res.status(400).json({
                err: "Payment failed"
            })
        }

    } catch(e) {
        res.status(500).json({err: e})
    }
})

module.exports = router;

