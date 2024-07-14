// supabase_connection/payments.js
const supabase = require('../db');

async function getPayments(req, res) {
    try {
        const { data, error } = await supabase
            .from('payments')
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

async function addPayment(req, res) {
    try {
        const { order_id, amount, payment_method } = req.body;
        const { data, error } = await supabase
            .from('payments')
            .insert([{ order_id, amount, payment_method }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Payment added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updatePayment(req, res) {
    try {
        const { id } = req.params;
        const { order_id, amount, payment_method } = req.body;
        const { data, error } = await supabase
            .from('payments')
            .update({ order_id, amount, payment_method })
            .eq('payment_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Payment updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deletePayment(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('payments')
            .delete()
            .eq('payment_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Payment deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getPayments,
    addPayment,
    updatePayment,
    deletePayment
};
