const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 150,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(helmet());
app.use(limiter);
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

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
