// supabase_connection/sampleData.js (after)
const supabase = require('../db');

async function getSampleData(req, res) {
    try {
        const { data, error } = await supabase
            .from('sample')
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

async function addSampleData(req, res) {
    try {
        const { id, name, city } = req.body;
        const { data, error } = await supabase
            .from('sample')
            .insert([{ id, name, city }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Record added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateSampleData(req, res) {
    try {
        const { id } = req.params;
        const { name, city } = req.body;
        const { data, error } = await supabase
            .from('sample')
            .update({ name, city })
            .eq('id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Record updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteSampleData(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('sample')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Record deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getSampleData,
    addSampleData,
    updateSampleData,
    deleteSampleData
};
