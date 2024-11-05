const supabase = require('../db');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    // Extract phone_number and password from the request body
    const { phone_number, password } = req.body;

    try {
        // Modify the Supabase query to match by phone_number instead of email
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone_number', phone_number);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!data || data.length === 0) {
            return res.status(401).json({ error: 'Invalid phone number or password' });
        }

        const user = data[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid phone number or password' });
        }

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        // Store user info in session
        req.session.user = userWithoutPassword;

        console.log('User data saved in session:', req.session.user);

        res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    login
};
