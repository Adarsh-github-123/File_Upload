const express = require('express');
const  router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
const {
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validators');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - isSeller
 *       properties:
 *         id:
 *           type: INTEGER
 *           description: The auto-generated id of the user
 *         name:
 *           type: STRING
 *           description: The name of the user
 *         email:
 *           type: STRING
 *           description: The email of the user
 *         password:
 *           type: STRING
 *           description: The password of the user
 *         isSeller:
 *           type: BOOLEAN
 *           description: The role of the user
 *       example:
 *         name: Harsh
 *         email: hk@gmail.com
 *         password: Harsh@58
 *         isSeller: false
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *  post:
 *    summary: Creates a new user
 *    requestBody: 
 *      required: true
 *      content: 
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/User'
 *    responses:
 *      201: 
 *        description: The user is successfully created
 *      404: 
 *        description: The user already exists
 *      400: 
 *        description: Validations failed
 *      500: 
 *        description: Internal server error
 */

router.post("/signup", async (req, res) => {
    try{
        const {name, email, password, isSeller} = req.body;
        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            return res.status(403).json({err: "User already exists"});
        }

        if(!validateName){
            return res.status(400).json({err: "Name validate fails"});
        }

        if(!validateEmail){
            return res.status(400).json({err: "Email validate fails"});
        }

        if(!validatePassword){
            return res.status(400).json({err: "Password validate fails"});
        }

        const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

        const user = {
            email,
            name,
            isSeller,
            password: hashedPassword
        }

        //Added to the database
        const createdUser = User.create(user);
        return res.status(201).json({
            message: `Welcome ${createdUser.name}`
        })


    } catch(e){
        console.log(">>>>>>>>",e);
        return res.status(500).send(e);
    }
})

router.post("/signin", async (req, res) => {
    try{
        const {email, password} = req.body;
        if(email.length === 0){
            return res.status(400).json({
                err: "Please provide email"
            })
        }

        if(password.length===0){
            return res.status(400).json({
                err: "Please provide password"
            })
        };

        const existingUser = await User.findOne({where: {email}});
        if(!existingUser){
            return res.status(404).json({
                err: "User not found"
            })
        }

        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatched){
            return res.status(400).json({
                err: "Email or password mismatch"
            })
        };

        const payload = { user: { id: existingUser.id}};
        const bearerToken = await jwt.sign(payload, "SECRET MESSAGE",{
            expiresIn: 360000
        });

        res.cookie('t', bearerToken, { expire: new Date() + 9999});

        return res.status(200).json({
            bearerToken
        })

    } catch(e) {
        console.log(">>>>>>>>",e);
        return res.status(500).send(e);
    }
});

router.get('/signout', (req, res) => {
    try{
        res.clearCookie('t');
        return res.status(200).json({message: "Cookie is Deleted"});
    } catch(e) {
        return res.status(500).send(e);
    }
})

module.exports = router;