const Redis = require('ioredis');
const dotenv = require('dotenv');

class DbConn {
    constructor() {
        dotenv.config();
        this.client = null;
    }

    connect = () => {
        if (this.client) {
            return Promise.resolve(this.client);
        }

        const {
            REDIS_HOST: HOST,
            REDIS_PORT: PORT,
            REDIS_PASSWORD: PASSWORD
        } = process.env;

        const config = {
            host: HOST || '127.0.0.1',
            port: PORT || 6379,
            password: PASSWORD || undefined
        };

        const client = new Redis(config);

        return new Promise((resolve, reject) => {
            client.on("error", err => {
                console.error("Redis connection error:", err);
                // Don't reject purely on error event as ioredis retries,
                // but for initial connection wait we might want to know.
            });
            client.on("connect", () => {
                console.log("Connected to Redis");
                this.client = client;
                resolve(client);
            });
        });
    }

    getClient = () => {
        if (!this.client) {
            // Auto connect if not connected
            return this.connect();
        }
        return Promise.resolve(this.client);
    }
}

module.exports = new DbConn();
