const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

// Route to get scraped data
app.get('/api/scraped-data', (req, res) => {
    try {
        const data = fs.readFileSync('./espnData.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ message: 'Error reading scraped data', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

