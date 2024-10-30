const supabase = require('../db');
const formidable = require("formidable");
const { getIo } = require('../../socket');

async function getNegotiations(req, res) {
    try {
        const { data, error } = await supabase
            .from('negotiations')
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

async function addNegotiation(req, res) {
    try {
        const {
            user_id,
            shop_id,
            crop_id,
            metric_system_id,
            user_price,
            user_amount,
            user_total,
            shop_number,
            crop_name,
            shop_price = null,
            shop_amount = null,
            shop_total = null,
            buyer_turn = false,
            user_open_for_negotiation,
            shop_open_for_negotiation = null,
            negotiation_status = 'Ongoing'
        } = req.body;

        // Ensure required fields are provided
        if (!user_id || !shop_id || !crop_id || !metric_system_id || !user_price || !user_amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert negotiation data into the negotiations table
        const { data, error } = await supabase
            .from('negotiations')
            .insert([{
                user_id: parseInt(user_id, 10),
                shop_id: parseInt(shop_id, 10),
                crop_id: parseInt(crop_id, 10),
                metric_system_id: parseInt(metric_system_id, 10),
                user_price: parseFloat(user_price),
                user_amount: parseFloat(user_amount),
                user_total: user_total ? parseFloat(user_total) : parseFloat(user_price) * parseFloat(user_amount),
                shop_price: shop_price ? parseFloat(shop_price) : null,
                shop_amount: shop_amount ? parseFloat(shop_amount) : null,
                shop_total: shop_total ? parseFloat(shop_total) : null,
                user_open_for_negotiation: Boolean(user_open_for_negotiation),
                shop_open_for_negotiation: Boolean(shop_open_for_negotiation),
                negotiation_status
            }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const io = getIo();

        const shopNumber = shop_number;
        const title = `AgriTayo`;
        const message = `You have a new negotiation for your product ${crop_name}.`;

        io.emit('sms sender', {
            title,
            message,
            phone_number: shopNumber
        });

        console.log(`SMS sent to ${shopNumber}: ${title} - ${message}`);

        res.status(201).json({ message: 'Negotiation added successfully', data });
    } catch (err) {
        console.error('Unexpected error during addNegotiation execution:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing negotiation
async function updateNegotiation(req, res) {
    console.log(' im called:', );
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Formidable error:", err);
                return res.status(500).json({ error: "Form parsing error" });
            }

            const {
                user_amount,
                user_price,
                user_total,
                buyer_turn,
                user_open_for_negotiation,
                negotiation_status,
                final_amount,
                final_price,
                final_total,
            } = fields;

            const getSingleValue = (value) =>
                Array.isArray(value) ? value[0] : value;

            // Prepare the update data
            const updatedNegotiation = {
                user_amount: parseInt(user_amount, 10),
                user_price: parseFloat(user_price, 10),
                user_total: parseFloat(user_total, 10),
                buyer_turn: getSingleValue(buyer_turn),
                user_open_for_negotiation: getSingleValue(user_open_for_negotiation),
                negotiation_status: getSingleValue(negotiation_status),
                final_amount: parseFloat(final_amount, 10),
                final_price: parseFloat(final_price, 10),
                final_total: parseFloat(final_total, 10),
            };

            // Update the crop in the database
            const { data, error } = await supabase
                .from('negotiations')
                .update(updatedNegotiation)
                .eq('negotiation_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Negotiation updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateNegotiation process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateShopNegotiation(req, res) {
    console.log(' im called:', );
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Formidable error:", err);
                return res.status(500).json({ error: "Form parsing error" });
            }

            const {
                shop_amount,
                shop_price,
                shop_total,
                buyer_turn,
                shop_open_for_negotiation,
                negotiation_status,
                final_amount,
                final_price,
                final_total,
            } = fields;

            const getSingleValue = (value) =>
                Array.isArray(value) ? value[0] : value;

            // Prepare the update data
            const updatedNegotiation = {
                shop_amount: parseInt(shop_amount, 10),
                shop_price: parseFloat(shop_price, 10),
                shop_total: parseFloat(shop_total, 10),
                buyer_turn: getSingleValue(buyer_turn),
                shop_open_for_negotiation: getSingleValue(shop_open_for_negotiation),
                negotiation_status: getSingleValue(negotiation_status),
                final_amount: parseFloat(final_amount, 10),
                final_price: parseFloat(final_price, 10),
                final_total: parseFloat(final_total, 10),
            };

            // Update the crop in the database
            const { data, error } = await supabase
                .from('negotiations')
                .update(updatedNegotiation)
                .eq('negotiation_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Negotiation updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateNegotiation process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Delete an existing negotiation
async function deleteNegotiation(req, res) {
    try {
        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
        }

        // Proceed to delete the negotiation from the database
        const { data, error } = await supabase
            .from('negotiations')
            .delete()
            .eq('negotiation_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Failed to delete negotiation from database' });
        }

        // Successful deletion response
        res.status(200).json({ message: 'Negotiation deleted successfully', data });
    } catch (err) {
        console.error('Error executing deleteNegotiation process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getNegotiations,
    addNegotiation,
    updateNegotiation,
    updateShopNegotiation,
    deleteNegotiation
};
