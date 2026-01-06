const axios = require('axios');

const testAggregateApi = async () => {
    const url = 'http://localhost:5000/api/aggregates/stats';

    try {
        console.log('--- Testing Aggregation API ---');
        const response = await axios.get(url);

        if (response.status === 200 && response.data.success) {
            console.log('✅ Aggregation API Result:', JSON.stringify(response.data.data, null, 2));
        } else {
            console.error('❌ Aggregation API Failed:', response.data);
        }

    } catch (err) {
        console.error('❌ Aggregation API Request Failed:', err.response ? err.response.data : err.message);
    }
};

testAggregateApi();
