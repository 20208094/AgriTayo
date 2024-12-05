const supabase = require('../db'); // Your Supabase instance
const formidable = require("formidable");

async function notifyUser(req, res) {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        const user_id = fields.user_id[0];
        console.log('user_id :', user_id);
        const title = fields.title[0];
        console.log('title :', title);
        const message = fields.message[0];
        console.log('message :', message);
        const is_read = false;
        console.log('is_read :', is_read);

        try {
            const { data, error } = await supabase.from("notifications").insert([
                {
                    user_id,
                    title,
                    message,
                    is_read
                },
            ]);

            if (error) {
                console.error("Supabase query failed:", error.message);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.status(201)
                .json({ message: "Crop category added successfully", data });
        } catch (err) {
            console.error("Error executing Supabase query:", err.message);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}

module.exports = {
    notifyUser
};
