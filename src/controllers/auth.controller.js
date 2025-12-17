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
