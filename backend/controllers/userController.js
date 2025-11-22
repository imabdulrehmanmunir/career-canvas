const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Hash password (Security Step)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 4. Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword, // Save the HASH, not the password
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // We give them an ID badge immediately
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Check for user email
    const user = await User.findOne({ email });

    // 2. Check password (Compare plain text '123' with Hash '$2a$...')
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};


// Generate JWT (The "ID Badge")
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token works for 30 days
    });
};

module.exports = {
    registerUser,
    loginUser
};