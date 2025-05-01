// Taha Rashid
// May 1, 2025
// RAWG API

const credentials = require('../credentials');
const axios = require('axios');

// RAWG search
// Only called when user is searching for games
const RAWGSearch = async (search, isPrecise) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.rawg.io/api/games?key=${credentials.RAWGKey}&search=${search}&search_precise=${isPrecise}`,
        headers: { }
      };

      const response = await axios.request(config);
      return response.data;
};

// RAWG game details
// Assumes we already know gameID
const RAWGGame = async (gameID) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.rawg.io/api/games/${gameID}?key=${credentials.RAWGKey}`,
        headers: { }
      };

    const response = await axios.request(config);
    return response.data;
}

// exporting functions
module.exports = { RAWGSearch, RAWGGame };


