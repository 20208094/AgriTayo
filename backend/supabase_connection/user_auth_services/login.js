const supabase = require('../db');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    const { phone_number, password } = req.body;

    try {
        // Query Supabase to find the user by phone number
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone_number', phone_number);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if the user exists
        if (!data || data.length === 0) {
            return res.status(401).json({ error: 'Invalid phone number or password' });
        }

        const user = data[0];

        // Ensure only users with `user_type_id === 1` can log in
        if (user.user_type_id !== 1) {
            return res.status(403).json({ error: 'Access denied: Unauthorized user type' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid phone number or password' });
        }

        // Remove password before storing user in session
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        // Store user info in session
        req.session.user = userWithoutPassword;

        console.log('User data saved in session:', req.session.user);

        // Respond with success and user data (without password)
        res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    login
};
