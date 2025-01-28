const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Roblox Inventory URL for Game Passes
  const robloxInventoryUrl = `https://www.roblox.com/users/${userId}/inventory/#!/game-passes`;

  try {
    // Fetch the user's inventory page
    const response = await axios.get(robloxInventoryUrl);

    if (response.status !== 200) {
      return res
        .status(response.status)
        .json({
          error: `Failed to fetch inventory page: ${response.statusText}`,
        });
    }

    // Load the HTML content with Cheerio
    const $ = cheerio.load(response.data);

    // Extract the game passes from the HTML
    const gamePasses = [];

    // You will need to inspect the page to see how game passes are structured
    // Example of how you can extract game passes:
    $("div.game-pass-item").each((index, element) => {
      const gamePass = {
        id: $(element).data("gamepass-id"), // This depends on the structure of the HTML
        name: $(element).find(".game-pass-name").text(),
        price: $(element).find(".game-pass-price").text(),
        createdBy: $(element).data("created-by"), // This will depend on how Roblox structures the HTML
      };

      gamePasses.push(gamePass);
    });

    // Filter out game passes created by the user (this will depend on data available in the HTML)
    const createdGamePasses = gamePasses.filter(
      (gamePass) => gamePass.createdBy === userId,
    );

    // Return the filtered game passes
    res.json({ gamePasses: createdGamePasses });
  } catch (error) {
    console.error("[ERROR] Error fetching game passes:", error.message);
    res
      .status(500)
      .json({ error: `Error fetching game passes: ${error.message}` });
  }
};
