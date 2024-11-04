const supabase = require('../db');
const bcrypt = require('bcryptjs');

async function register(req, res) {
    const { firstname, middlename, lastname, email, password, secondary_phone_number, phone_number, gender, birthday, user_type_id, verified } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{
                firstname,
                middlename,
                lastname,
                email,
                secondary_phone_number,
                password: hashedPassword,
                phone_number,
                gender,
                birthday,
                user_type_id,
                verified
            }])
            .select();

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Supabase query failed', details: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ error: 'User registration failed, no data returned from Supabase' });
        }

        res.status(201).json({ message: 'User registered successfully', user: data[0] });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

module.exports = {
    register
};
