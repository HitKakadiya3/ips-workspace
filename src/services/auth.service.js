exports.login = async ({ email, password }) => {
    if (email !== 'admin@test.com' || password !== '123456') {
        throw { status: 401, message: 'Invalid credentials' };
    }

    return {
        message: 'Login successful',
        token: 'dummy-jwt-token'
    };
};
