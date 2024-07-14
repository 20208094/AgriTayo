const sql = require('mssql');
const poolPromise = require('./db'); // Create a separate file for database connection

async function getSampleData(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM dbo.sample');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error executing SQL query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addSampleData(req, res) {
    try {
        const { id, name, city } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('city', sql.NVarChar, city)
            .query('INSERT INTO dbo.sample (id, name, city) VALUES (@id, @name, @city)');
        res.status(201).json({ message: 'Record added successfully' });
    } catch (err) {
        console.error('Error executing SQL query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateSampleData(req, res) {
    try {
        const { id } = req.params;
        const { name, city } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('city', sql.NVarChar, city)
            .query('UPDATE dbo.sample SET name = @name, city = @city WHERE id = @id');
        res.status(200).json({ message: 'Record updated successfully' });
    } catch (err) {
        console.error('Error executing SQL query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteSampleData(req, res) {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.sample WHERE id = @id');
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Error executing SQL query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getSampleData,
    addSampleData,
    updateSampleData,
    deleteSampleData
};
