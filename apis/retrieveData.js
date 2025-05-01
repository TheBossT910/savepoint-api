// Taha Rashid
// May 1, 2025
// retrieves data from all APIs and structures into appropriate object

// import functions
const rawg = require('./rawg');
const pricecharting = require('./pricecharting');
const igdb = require('./igdb')

// converts game name to slug
// courtesy of ChatGPT (will make own function later, just need to have working product first!)
function slugify(gameName) {
    return gameName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters except spaces and hyphens
      .replace(/\s+/g, '-')         // replace spaces with hyphen
      .replace(/-+/g, '-');         // remove duplicate hyphens
}


// getting data when we have upc/slug
const retrieveData = async (uid) => {
    let res, raw;

    // data object
    let data = {
        name: "",
        slug: "",
        description: "",
        release_date: "",
        cover: "",
        media: [],
        // website: "", 
        // metacritic_rating: "",
        loose_price: '',
        complete_price: '',
        new_price: '',
    }

    // getting prices and slug
    res = await pricecharting.pricechartingUID(uid)
    raw = res.products[0];
    data.loose_price = raw.price1;
    data.complete_price = raw.price3;
    data.new_price = raw.price2;

    data.slug = slugify(raw.productName);

    // getting game data
    res = await igdb.IGDBGame(data.slug)
    raw = res[0];
    data.name = raw.name;
    data.description = raw.summary;
    data.release_date = raw.first_release_date;
    data.cover = raw.cover;
    data.media = raw.screenshots;

    // getting cover
    res = await igdb.IGDBCover(data.cover);
    raw = res[0];
    data.cover = 'https:' + raw.url.replace('t_thumb', 't_1080p');

    // getting media
    res = await igdb.IGDBScreenshot(data.media);
    data.media = Array.from(res, (item) => 'https:' + item.url.replace('t_thumb', 't_1080p'));

    return data;
}

// getting slug from search
const retrieveSearch = async (search) => {
    let res = await rawg.RAWGSearch(search, true);
    let raw = res.results[0];
    return raw.slug;
}

module.exports = { retrieveData, retrieveSearch };

// testing
// let rawgid = "58779";
// let upc = "093155176119";    // Starfield
// let upc = "045496590741";    // SMO
// let search = "Starfield";

// retrieveData(upc)
//     .then( (res) => console.log(res) );

// retrieveSearch(search)
//     .then( (res) => {
//         console.log(`Slug is: ${res}`);
//         return retrieveData(res);
//     })
//     .then( (res) => console.log(res) );






