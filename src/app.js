const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const redisRateLimiter = require('./middlewares/rateLimiter.middleware');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(redisRateLimiter);
app.use(cors());

// Express 5 query getter workaround
app.use((req, res, next) => {
    if (req.query) {
        Object.defineProperty(req, 'query', {
            value: { ...req.query },
            enumerable: true,
            writable: true,
            configurable: true,
        });
    }
    next();
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
