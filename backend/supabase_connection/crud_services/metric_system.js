// supabase_connection/metric_system.js
const supabase = require('../db');

async function getMetricSystems(req, res) {
    try {
        const { data, error } = await supabase
            .from('metric_system')
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

async function addMetricSystem(req, res) {
    try {
        const { metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds } = req.body;
        const { data, error } = await supabase
            .from('metric_system')
            .insert([{ metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Metric system added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateMetricSystem(req, res) {
    try {
        const { id } = req.params;
        const { metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds } = req.body;
        const { data, error } = await supabase
            .from('metric_system')
            .update({ metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds })
            .eq('metric_system_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Metric system updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteMetricSystem(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('metric_system')
            .delete()
            .eq('metric_system_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Metric system deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getMetricSystems,
    addMetricSystem,
    updateMetricSystem,
    deleteMetricSystem
};
