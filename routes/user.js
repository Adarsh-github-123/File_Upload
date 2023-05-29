const express = require('express');
const  router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
 
const {
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validators');

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
            message: `Welcome ${createdUser.email}`
        })


    } catch(e){
        console.log(">>>>>>>>",e);
        return res.status(500).send(e);
    }
})

module.exports = router;