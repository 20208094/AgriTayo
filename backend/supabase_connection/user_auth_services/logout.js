async function logout(req, res) {
    try {
        if (req.session) {
            // Clear the session user information
            req.session.user = null;
            res.status(200).json({ message: 'Logout successful' });
        } else {
            res.status(500).json({ error: 'Session not initialized' });
        }
    } catch (err) {
        console.error('Error during logout:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    logout
};
