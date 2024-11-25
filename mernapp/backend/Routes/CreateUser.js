const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = process.env.JWT_SECRET || "MynameisEndtoEndYouTubeChannel$#"; // Use environment variable for JWT secret

// Route to create a new user
router.post("/createuser", [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        };

        await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location
        });

        res.json({ success: true, message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
});

// Route to login a user
router.post("/loginuser", [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let userData = await User.findOne({ email });  // Use findOne instead of find
        if (!userData) {
            return res.status(400).json({ error: "Invalid credentials (email not found)" });
        }

        // Fixing the password comparison (use the stored hashed password for comparison)
        const pwdCompare = await bcrypt.compare(password, userData.password); // Compare entered password with stored hash

        if (!pwdCompare) {
            return res.status(400).json({ error: "Invalid credentials (password mismatch)" });
        }

        const data = {
            user: {
                id: userData.id
            }
        };

        const authToken = jwt.sign(data, jwtSecret, { expiresIn: '1h' }); // Add expiration to the token
        return res.json({ success: true, authToken: authToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;