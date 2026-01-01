const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const data = await authService.register(req.body);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const data = await authService.login(req.body);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        const data = await authService.refreshToken(refreshToken);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        const data = await authService.refreshToken(refreshToken);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
