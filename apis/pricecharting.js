// Taha Rashid
// May 1, 2025
// PriceCharting scraper

const axios = require('axios');

// gets pricing data of game using game's UID (barecode id)
const getValuation = async (uid) => {
    const config = {
        method: 'GET',
        url: `https://www.pricecharting.com/search-products?type=videogames&q=${uid}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        },
    };

    const response = await axios.request(config);
    return response.data;
}

module.exports = { getValuation };