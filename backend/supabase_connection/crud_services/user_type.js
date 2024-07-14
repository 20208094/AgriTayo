// supabase_connection/user_type.js
const supabase = require('../db');

async function getUserTypes(req, res) {
    try {
        const { data, error } = await supabase
            .from('user_type')
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

async function addUserType(req, res) {
    try {
        const { user_type_name, user_type_description } = req.body;
        const { data, error } = await supabase
            .from('user_type')
            .insert([{ user_type_name, user_type_description }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'User type added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateUserType(req, res) {
    try {
        const { id } = req.params;
        const { user_type_name, user_type_description } = req.body;
        const { data, error } = await supabase
            .from('user_type')
            .update({ user_type_name, user_type_description })
            .eq('user_type_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User type updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteUserType(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('user_type')
            .delete()
            .eq('user_type_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User type deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUserTypes,
    addUserType,
    updateUserType,
    deleteUserType
};
