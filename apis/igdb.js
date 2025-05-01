// Taha Rashid
// April 30, 2025
// IGDB API

const credentials = require('../credentials');
const axios = require('axios');

// general function, used by other IGDB functions
const IGDBGeneral = async (url, data) => {
    let config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Client-ID': credentials.ClientID, 
          'Authorization': credentials.Authorization, 
          'Content-Type': 'application/raw', 
          'Cookie': '__cf_bm=PlCl1o47o2P4UNo9HUWNNT47O0HAMD0T53k4KrapxgE-1746040815-1.0.1.1-iEsmbKVv10qhLevW8XN6EbN2kfptZz5eaOox9fet3tYxaQe_IWYCPCWX0.avZefiHBwTBFyVILe67hIJrrr.d3Urf5yfFbPthwQh0gJdGQM'
        },
        data : data
      };
    
    const response = await axios.request(config);
    return response.data;
}

const IGDBGame = (slug) => {
    let data = `fields aggregated_rating,cover,first_release_date,name,platforms,screenshots,summary,url,videos,websites; where slug = "${slug}";`;
    let url = 'https://api.igdb.com/v4/games';
    return IGDBGeneral(url, data);
}

const IGDBCover = (gameID) => {
    let data = `fields url, width, height; where id=${gameID};`;
    let url = 'https://api.igdb.com/v4/covers';
    return IGDBGeneral(url, data);
}

const IGDBWebsite = (websiteIDs) => {
    let data = `fields url, type; where id = (${websiteIDs.join(", ")});`;
    let url = 'https://api.igdb.com/v4/websites';
    return IGDBGeneral(url, data);
}

const IGDBScreenshot = (screenshotIDs) => {
    let data = `  fields url, width, height; where id = (${screenshotIDs.join(", ")});`;
    let url = 'https://api.igdb.com/v4/screenshots';
    return IGDBGeneral(url, data);
}

module.exports = { IGDBGame, IGDBCover, IGDBWebsite, IGDBScreenshot };
