const axios = require('axios');
const Redis = require('ioredis');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});

async function verify() {
    console.log('--- Testing Redis Session Storage ---');

    try {
        // 1. Set session
        console.log('Setting session...');
        const setRes = await axios.get(`${API_URL}/session-set`);
        const cookie = setRes.headers['set-cookie'];
        console.log('Session set. Cookie:', cookie);

        // 2. Get session
        console.log('\nGetting session...');
        const getRes = await axios.get(`${API_URL}/session-get`, {
            headers: { Cookie: cookie.join('; ') }
        });
        console.log('Session value retrieved:', getRes.data.testValue);

        if (getRes.data.testValue === 'RedisSessionWorking') {
            console.log('\n✅ Session retrieval working!');
        } else {
            console.log('\n❌ Session retrieval failed.');
        }

        // 3. Check Redis
        console.log('\nChecking Redis for "sess:*" keys...');
        const keys = await redis.keys('sess:*');
        console.log('Found session keys:', keys);

        if (keys.length > 0) {
            console.log('✅ Session key found in Redis!');
        } else {
            console.log('❌ No session key found in Redis.');
        }

    } catch (error) {
        console.error('Verification failed:', error.message);
    } finally {
        redis.quit();
    }
}

verify();
