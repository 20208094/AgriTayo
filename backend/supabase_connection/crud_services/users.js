const supabase = require('../db');
const bcrypt = require('bcrypt');

async function getUsers(req, res) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(data);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addUser(req, res) {
    try {
        const { firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified } = req.body;

        // Hash the password before inserting it
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{ firstname, middlename, lastname, email, password: hashedPassword, phone_number, gender, birthday, user_type_id, verified }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'User added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified } = req.body;

        // Only hash the password if it is provided
        const updateData = {
            firstname,
            middlename,
            lastname,
            email,
            phone_number,
            gender,
            birthday,
            user_type_id,
            verified
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('user_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('user_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
