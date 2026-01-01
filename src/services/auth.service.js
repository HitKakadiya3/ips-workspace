const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

exports.register = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) {
        throw { status: 400, message: 'Email already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'employee'
    });

    return {
        message: 'Registration successful',
        token: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
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
        token: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

exports.refreshToken = async (token) => {
    try {
        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw { status: 401, message: 'Invalid refresh token' };
        }

        return {
            token: generateAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id)
        };
    } catch (error) {
        throw { status: 401, message: 'Invalid refresh token' };
    }
};
