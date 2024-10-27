// sms_sender.js
const { getIo } = require('../socket');

/**
 * Sends an SMS using Socket.IO
 * @param {object} req - The request object containing title, message, and phone_number
 * @param {object} res - The response object to send the response
 */
function smsSender(req, res) {
    const { title, message, phone_number } = req.body; // Extract title, message, and phone number from request body

    // Check if all required fields are present
    if (!title || !message || !phone_number) {
        return res.status(400).json({ error: 'Title, message, and phone number are required.' });
    }

    // Access the Socket.io instance
    const io = getIo();

    // Emit the 'sms sender' event
    io.emit('sms sender', {
        title,
        message,
        phone_number
    });
}

module.exports = {
    smsSender
};
