// Taha Rashid
// April 30, 2025
// IGDB API

const credentials = require('../credentials');
const axios = require('axios');

const dataLimit = 50;

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

// Specific game's details
const IGDBGame = (slug) => {
    let data = `fields aggregated_rating,cover.url,first_release_date,name,platforms.name,screenshots.url,summary,url,videos.video_id,websites.url; where slug = "${slug}";`;
    let url = 'https://api.igdb.com/v4/games';
    return IGDBGeneral(url, data);
}

// Popular games
const IGDBPopular = () => {
    let data = `fields aggregated_rating,cover,first_release_date,name,platforms.name,screenshots.url,summary,url,videos.video_id,websites.url; sort total_rating_count desc; where total_rating_count != null; limit ${dataLimit};`;
    let url = 'https://api.igdb.com/v4/games';
    return IGDBGeneral(url, data);
}

// Trending games
const IGDBTrending = () => {
    let currentDate = "1641094034"; // temp, represented as Unix time
    let data = `fields aggregated_rating,cover,first_release_date,name,platforms.name,screenshots.url,summary,url,videos.video_id,websites.url; where first_release_date > ${currentDate} & (follows > 10 | total_rating_count > 20); sort total_rating_count desc; limit ${dataLimit};`;
    let url = 'https://api.igdb.com/v4/games';
    return IGDBGeneral(url, data);
}

// Highest rated games for a specific platform
const IGDBHighestRated = (platform) => {
    let data = `fields aggregated_rating,cover,first_release_date,name,platforms.name,screenshots.url,summary,url,videos.video_id,websites.url; sort total_rating_count desc; where platforms.name = "${platform}" & total_rating_count != null; limit ${dataLimit};`;
    let url = 'https://api.igdb.com/v4/games';
    return IGDBGeneral(url, data);
}

module.exports = { IGDBGame, IGDBPopular, IGDBTrending, IGDBHighestRated };
