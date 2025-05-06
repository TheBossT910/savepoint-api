// Taha Rashid
// May 1, 2025
// RAWG API

// importing .env variables
require('dotenv').config()
const axios = require('axios');

// called when user is searching for games
const getSearch = async (search, isPrecise) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}&search=${search}&search_precise=${isPrecise}`,
        headers: { }
      };

      const response = await axios.request(config);
      return response.data;
};

// exporting functions
module.exports = { getSearch };


