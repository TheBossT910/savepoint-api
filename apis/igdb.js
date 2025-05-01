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


// // retrieving data
// let retrieveData = async (game, uid) => {
//     // new data object
//     let data = {
//         IGDB_id: -1,
//         aggregated_rating: -1,
//         cover: "",
//         first_release_date: -1,
//         name: "",
//         platforms: [],
//         media: [],
//         description: "",
//         videos: [],
//         official_websites: [],
//         loose_price: '',
//         complete_price: '',
//         new_price: '',
//         uid: '',
//     }

//     // declaring variables
//     let res, raw;

//     // pricing from PriceCharting only if we have a uid
//     if (uid) {
//         res = await pricechartingUID(uid);
//         raw = res.products[0];
    
//         data.loose_price = raw.price1;
//         data.complete_price = raw.price3;
//         data.new_price = raw.price2;
//         data.uid = uid;
//     }

//     // Game
//     res = await IGDBGame(game);
//     raw = res[0];

//     data.IGDB_id = raw.id;
//     data.aggregated_rating = raw.aggregated_rating;
//     data.cover = raw.cover;
//     data.first_release_date = raw.first_release_date;
//     data.name = raw.name;
//     data.platforms = raw.platforms;
//     data.media = raw.screenshots;
//     data.description = raw.summary;
//     data.videos = raw.videos;
//     data.official_websites = raw.websites;

//     // Cover
//     res = await IGDBCover(data.cover);
//     raw = res[0];
//     data.cover = raw;

//     // Website
//     res = await IGDBWebsite(data.official_websites);
//     // only save the official sites
//     data.official_websites = res.filter( (website) => website.type == 1);

//     // Screenshot
//     res = await IGDBScreenshot(data.media);
//     data.media = res;

//     return data;
// }

// // testing data retrival
// let game = 'Super Mario Odyssey';
// let uid = '045496590741';
// // returns a promise
// let response = retrieveData(game, uid); 
// response
//     .then( (data) => console.log(data))
