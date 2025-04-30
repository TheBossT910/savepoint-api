// Taha Rashid
// April 30, 2025
// Accessing IGDB API

const axios = require('axios');

// functions to get data from APIs
// gets pricing data of game using game's UID (barecode id)
const pricechartingUID = async (uid) => {
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

// general function, used by other IGDB functions
const IGDBGeneral = async (url, data) => {
    let config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Client-ID': '8ddvkgajnp2c7xsdu0kt9xk3wwth3l', 
          'Authorization': 'Bearer 8k7y47pcexz5cel4v3368bpj7t70j2', 
          'Content-Type': 'application/raw', 
          'Cookie': '__cf_bm=PlCl1o47o2P4UNo9HUWNNT47O0HAMD0T53k4KrapxgE-1746040815-1.0.1.1-iEsmbKVv10qhLevW8XN6EbN2kfptZz5eaOox9fet3tYxaQe_IWYCPCWX0.avZefiHBwTBFyVILe67hIJrrr.d3Urf5yfFbPthwQh0gJdGQM'
        },
        data : data
      };
    
    const response = await axios.request(config);
    return response.data;
}

const IGDBGame = (game) => {
    let data = `fields aggregated_rating,cover,first_release_date,name,platforms,screenshots,summary,url,videos,websites; where name = "${game}" & game_type = 0;`;
    let url = 'https://api.igdb.com/v4/games';
    return IGDBGeneral(url, data);
}

const IGDBCover = (gameID) => {
    let data = `fields url, width, height; where id=${gameID};`;
    let url = 'https://api.igdb.com/v4/covers';
    return IGDBGeneral(url, data);
}

const IGDBWebsite = (websiteIDs) => {
    let data = `fields url, type; where id = (${websiteIDs.join(" ")});`;
    let url = 'https://api.igdb.com/v4/websites';
    return IGDBGeneral(url, data);
}

const IGDBScreenshot = (screenshotIDs) => {
    let data = `  fields url, width, height; where id = (${screenshotIDs.join(" ")});`;
    let url = 'https://api.igdb.com/v4/screenshots';
    return IGDBGeneral(url, data);
}



// IGDBGame("Super Mario Galaxy")
//     .then( (res) => {
//         console.log(res);
//     })