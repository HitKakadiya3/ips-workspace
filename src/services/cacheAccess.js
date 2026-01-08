const dbConn = require('../config/dbConn');
const _ = require('lodash');

class CacheAccess {

    // Ensure we have a client before performing operations
    async getClient() {
        return await dbConn.getClient();
    }

    get = async (key) => {
        const client = await this.getClient();
        return client.get(key).then(data => {
            try {
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error("JSON parse error for key:", key);
                return null;
            }
        });
    }

    set = async (key, data, expiry) => {
        const client = await this.getClient();
        if (_.isEmpty(expiry) && expiry !== 0) {
            expiry = 3 * 60; // 3min
        }
        // ioredis syntax: set(key, value, 'EX', seconds)
        // Ensure data is stringified
        const val = typeof data === 'string' ? data : JSON.stringify(data);
        return client.set(key, val, 'EX', expiry);
    }

    del = async (key) => {
        const client = await this.getClient();
        return client.del(key);
    }

    clear = async () => {
        const client = await this.getClient();
        return client.flushdb();
    }

    /**
     * Helper to get or fetch and cache
     */
    remember = async (key, ttl, fetchFunction) => {
        const cached = await this.get(key);
        if (cached) {
            return cached;
        }

        const data = await fetchFunction();

        if (data !== undefined && data !== null) {
            await this.set(key, data, ttl);
        }

        return data;
    }
}

module.exports = new CacheAccess();
