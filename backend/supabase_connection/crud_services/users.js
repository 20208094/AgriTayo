// supabase_connection/users.js
const supabase = require('../db');

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
        const { data, error } = await supabase
            .from('users')
            .insert([{ firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified }]);

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
        const { data, error } = await supabase
            .from('users')
            .update({ firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified })
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
