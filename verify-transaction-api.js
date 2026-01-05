const axios = require('axios');

const testApi = async () => {
    const basUrl = 'http://localhost:5000/api/transactions/test';

    try {
        console.log('--- Testing Successful Transaction ---');
        const successRes = await axios.post(basUrl, { scenario: 'success' });
        console.log('✅ Success Scenario Result:', successRes.data);
    } catch (err) {
        console.error('❌ Success Scenario Failed:', err.response ? err.response.data : err.message);
    }

    try {
        console.log('\n--- Testing Failed Transaction (Rollback) ---');
        await axios.post(basUrl, { scenario: 'fail' });
    } catch (err) {
        if (err.response && err.response.status === 400 && err.response.data.success === false) {
            console.log('✅ Rollback Scenario Result (Expected 400):', err.response.data);
        } else {
            console.error('❌ Rollback Scenario Failed (Unexpected):', err.response ? err.response.data : err.message);
        }
    }
};

testApi();
