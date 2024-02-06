// routes/admin.js

const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/auth');
const Shop = require('../models/shop'); // Assuming your model is named 'Shop'

// Route for admin to create a new seller
router.post('/create-seller', isAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newSeller = await Shop.create({
        ...req.body,
        status: 'Approved', // Set the status to "Approved" by default
        role: 'Seller', // Set the role to "Seller" by default
      });

    

    res.status(201).json({
      success: true,
      message: 'Seller account created by admin.',
      seller: newSeller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
