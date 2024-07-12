const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { getSampleData, addSampleData, updateSampleData, deleteSampleData } = require('./azure_sql_connection/sampleData');
const loginRouter = require('./azure_sql_connection/login'); // Correct import for loginRouter

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// API routes for sample data
app.get('/api/data/sample', getSampleData);
app.post('/api/data/sample', addSampleData);
app.put('/api/data/sample/:id', updateSampleData);
app.delete('/api/data/sample/:id', deleteSampleData);

// API routes for login
app.use('/api/login', loginRouter); // Mount loginRouter at /api/login

// Serve frontend files
const distPath = path.join(__dirname, '../frontend/dist/');
app.use(express.static(distPath));

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: distPath });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
