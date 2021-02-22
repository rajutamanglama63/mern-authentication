const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../model/User");

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        let { email, password } = req.body;
    
        if(!email || !password) {
            return res.status(400).json({msg : "All fields are required."})
        }

        if(password.length < 5) {
            return res.status(400).json({msg : "Password should be at least 5 character long."})
        }

        const existingUser = await User.findOne({email : email});
        if(existingUser) {
            return res.status(400).json({msg : "Account with this email already exist."})
        }

        const salt = await bcrypt.genSalt();
        const hassedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password : hassedPassword,
        });

        const savedUser = await newUser.save();

        // sign the token
        const token = jwt.sign({user : savedUser._id}, process.env.JWT_SECRET);

        // send the token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly : true
        }).send()

    } catch (err) {
        res.status(500).json({error : err.message});
    }
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({msg : "All fields are required."})
        }

        const existingUser = await User.findOne({email: email});

        if(!existingUser) {
            return res.status(401).json({msg : "An account with this email has not been created."})
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch) {
            return res.status(401).json({msg : "Invalid credentials"})
        }

        // sign the token
        const token = jwt.sign({user: existingUser._id}, process.env.JWT_SECRET);
        res.json({
            token,
            user : {
                user : existingUser._id,
            }
        });

        // send the token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly : true
        }).send()


    } catch (err) {
        res.status(500).json({error : err.message});
    }
})


router.get('/logout', (req, res) => {
    res.cookie("token", "", {
        httpOnly : true,
        expires : new Date(0)
    }).send()
})



router.get('/loggedIn', (req, res) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.json(false)
        }

        jwt.verify(token, process.env.JWT_SECRET);

        res.send(true)

    } catch (err) {
        res.json(false)
    }
})

module.exports = router;