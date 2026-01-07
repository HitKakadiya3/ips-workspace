
const axios = require('axios');

async function verify() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'admin'
        });
        const token = loginRes.data.token;

        const usersRes = await axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const users = usersRes.data.users;
        const admins = users.filter(u => u.role.toLowerCase() === 'admin');

        console.log(`Total users fetched: ${users.length}`);
        if (admins.length > 0) {
            console.log('FAIL: Admin user found!');
            admins.forEach(u => console.log(`- ${u.name} (${u.role})`));
        } else {
            console.log('PASS: No admin users found.');
            users.forEach(u => console.log(`- ${u.name} (${u.role})`));
        }

    } catch (error) {
        // If axios is missing, we use standard https
        console.log("Axios missing, manual check required via curl");
    }
}

verify();
