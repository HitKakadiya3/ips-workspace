const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

exports.register = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) {
        throw { status: 400, message: 'Email already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return {
        message: 'Registration successful',
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    };
};

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    return {
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    };
};
