// Entry point: Starts the Express server
require('dotenv').config();

const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// Serve all frontend files from the /views directory
app.use(express.static(path.join(__dirname, 'views')));

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Catch-all: serve index.html for any unknown route ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🎵 Music Player running at http://localhost:${PORT}`);
});
