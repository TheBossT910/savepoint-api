// Taha Rashid
// May 1, 2025
// retrieves data from all APIs and structures into appropriate object

// import functions
const rawg = require('./rawg');
const pricecharting = require('./pricecharting');
const igdb = require('./igdb')

// fuzzy search library
const Fuse = require('fuse.js')

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

// returns the index in the list with the closet search match
const fuzzySearch = (list, search) => {
    const options = {
        includeScore: true,
        keys: ['productName']
    }

    const fuse = new Fuse(list, options);
    const result = fuse.search(search);
    return result[0].refIndex;
}



// getting data when we have upc/slug
const retrieveData = async (uid, isSlug) => {
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
    let products = res.products;

    if (isSlug) {
        // match the closest name
        let matchedIndex = fuzzySearch(products, uid);
        raw = products[matchedIndex];

        // uid is already the slug
        data.slug = uid;
    } else {
        // select the first item
        raw = products[0];

        // need to get the slug
        data.slug = slugify(raw.productName);
    }

    data.loose_price = raw.price1;
    data.complete_price = raw.price3;
    data.new_price = raw.price2;

    // getting game data
    res = await igdb.IGDBGame(data.slug)
    raw = res[0];
    data.name = raw.name;
    data.description = raw.summary;
    data.release_date = raw.first_release_date;

    // getting cover
    data.cover = 'https:' + raw.cover.url.replace('t_thumb', 't_1080p');

    // getting media
    data.media = Array.from(raw.screenshots, (item) => 'https:' + item.url.replace('t_thumb', 't_1080p'));

    return data;
}

// getting slug from search
const retrieveSearch = async (search) => {
    let res = await rawg.RAWGSearch(search, true);
    let raw = res.results[0];
    return raw.slug;
}

// TODO: format these into data object. Currently, we are simply sending the raw result from the IGDB API itself!
// These don't need all data. We just need cover image, name, platform(?) since these are simply just displayed
// the other data (retrieveData and retrieveSearch) are actual results when we want to look at the details of a specific show

// getting popular games
const gamesPopular = () => {
    return igdb.IGDBPopular();
}

// getting trending games
const gamesTrending = () => {
    return igdb.IGDBTrending();
}

// getting highest rated games for specified platform
const gamesHighestRated = (platform) => {
    return igdb.IGDBHighestRated(platform);
}

module.exports = { retrieveData, retrieveSearch, gamesPopular, gamesTrending, gamesHighestRated };

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