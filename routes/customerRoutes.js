const express = require("express");

const auth = require("../middleware/auth"); 
const Customer = require("../model/Customer");

const router = express.Router();

router.post('/register', auth, async (req, res) => {
    try {
        const { name } = req.body;

        const newCustomer = new Customer({
            name,
        });

        const savedCustomer = await newCustomer.save();

        res.json(savedCustomer);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
})


module.exports = router;