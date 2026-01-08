const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
    console.error('Redis Rate Limiter Error:', err);
});

const redisRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

module.exports = redisRateLimiter;
