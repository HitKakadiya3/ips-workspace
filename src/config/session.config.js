const session = require('express-session');
const { RedisStore } = require('connect-redis');
const Redis = require('ioredis');
require('dotenv').config();

// Create Redis client for sessions
const sessionRedisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});

sessionRedisClient.on('error', (err) => {
    console.error('Session Redis Error:', err);
});

sessionRedisClient.on('connect', () => {
    console.log('Connected to Redis for Sessions');
});

// Initialize store
const redisStore = new RedisStore({
    client: sessionRedisClient,
    prefix: "sess:",
});

const sessionConfig = session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'ips_workspace_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevents client side JS from reading the cookie 
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
});

module.exports = sessionConfig;
