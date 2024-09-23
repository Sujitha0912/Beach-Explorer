const express = require('express');
const app = express();
const port = 3000;

const { getBeaches, getBeachDetails } = require('./database');

app.use(express.static('frontend'));

app.get('/beaches', async (req, res) => {
    try {
        const beaches = await getBeaches();
        res.json(beaches);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/beach-details', async (req, res) => {
    const beachId = req.query.id;
    if (!beachId) {
        return res.status(400).json({ error: 'Beach ID is required' });
    }

    try {
        const beachDetails = await getBeachDetails(beachId);
        res.json(beachDetails);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
