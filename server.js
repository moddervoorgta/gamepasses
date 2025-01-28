const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/player-created-gamepasses', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const ROBLOX_API_URL = `https://games.roblox.com/v1/users/${userId}/game-passes`;

    try {
        const response = await axios.get(ROBLOX_API_URL);

        if (response.status === 200) {
            // Return the list of game passes
            res.json(response.data);
        } else {
            console.error(`[ERROR] Roblox API returned ${response.status}: ${response.statusText}`);
            res.status(response.status).json({ error: `Failed to fetch game passes: ${response.statusText}` });
        }
    } catch (error) {
        console.error(`[ERROR] Error making request to Roblox API:`, error.message);
        res.status(500).json({ error: `Error making request to Roblox API: ${error.message}` });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
