const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const poolPromise = require('./db'); // Assuming db.js contains your database connection setup

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login successful');
    res.json({ message: 'Login successful', user: { firstname: user.firstname, lastname: user.lastname, email: user.email } });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
