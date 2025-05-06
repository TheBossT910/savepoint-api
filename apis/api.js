// Taha Rashid
// May 1, 2025
// retrieves data from all APIs and structures into appropriate object

// import functions
const rawg = require('./rawg');
const pricecharting = require('./pricecharting');
const igdb = require('./igdb')
const db = require('../database/db');

// fuzzy search library
const Fuse = require('fuse.js');

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

// converts Unix time to timestamp
// Courtesy of Stack Overflow, https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    let time = `${year}-${month}-${date}`
    return time;
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

// helper function used by gamesPopular, gamesTrending, gamesHighestRated
const gamesGeneral =  (res) => {
    let raw = Array.from( res, (item) => {
        let data = {
            name: item.name,
            slug: item.slug,
            release_date: timeConverter(item.first_release_date),
            image: 'https:' + item.cover.url.replace('t_thumb', 't_1080p'),
            rating: item.aggregated_rating,
        };
        return data;
    })

    // return all formatted results
    return raw;
}

// helper function to get data from external api when we have upc/slug
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
        // platforms: [],
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
    data.release_date = timeConverter(raw.first_release_date);

    // getting cover
    data.cover = 'https:' + raw.cover.url.replace('t_thumb', 't_1080p');

    // getting media
    data.media = Array.from(raw.screenshots, (item) => 'https:' + item.url.replace('t_thumb', 't_1080p'));

    return data;
}



// getting slug from search
const retrieveSearch = async (search) => {
    let res = await rawg.RAWGSearch(search, true);
    let raw = Array.from( res.results, (item) => {
        let data = {
            name: item.name,
            slug: item.slug,
            release_date: item.released,
            image: item.background_image,
        };
        return data;
    });

    // return all formatted results
    return raw;
}

// create game data 
const createGame = async (slug, upc) => {
    // set to sentinel value if no upc found
    if (upc == '') upc = '-1';

    // if we have upc, use upc
    if (upc != -1) {
            res = await retrieveData(upc, false);
    } else {    // else use slug
        res = await retrieveData(slug, true);
    }

    // create record in database
    const productsRecord = {
        slug: res.slug,
        upc: null,
        name: res.name,
        cover: res.cover,
        media: res.media,
        description: res.description,
        release_date: null,
        price_new: Number(res.new_price.replace(/[^0-9.-]+/g,"")),
        price_complete: Number(res.complete_price.replace(/[^0-9.-]+/g,"")),
        price_loose: Number(res.loose_price.replace(/[^0-9.-]+/g,"")),
        price_last_updated: null,
    };
    await db.createProducts(productsRecord);

    // return data we just scrapped
    return res;
};

const getGame = async (id) => { 
    return db.getProducts(id) 
};

// getting popular games
const gamesPopular = async () => {
    let res =  await igdb.IGDBPopular();
    let raw = gamesGeneral(res);
    return raw;
}

// getting trending games
const gamesTrending = async () => {
    let res =  await igdb.IGDBTrending();
    let raw = gamesGeneral(res);
    return raw;
}

// getting highest rated games for specified platform
const gamesHighestRated = async (platform) => {
    let res =  await igdb.IGDBHighestRated(platform);
    let raw = gamesGeneral(res);
    return raw;
}

module.exports = { retrieveSearch, createGame, getGame, gamesPopular, gamesTrending, gamesHighestRated };

// testing
// let rawgid = "58779";
// let upc = "093155176119";    // Starfield
// let upc = "045496590741";    // SMO
// let search = "Super Mario Odyssey";
// let upc = 'super-mario-odyssey';

// retrieveData(upc, true)
//     .then( (res) => console.log(res) );

// retrieveSearch(search)
//     .then( (res) => console.log(res) );

// gamesTrending()
//     .then( (res) => console.log(res) );

// retrieveDB('super-mario-odyssey', '')
//     .then( (res) => console.log(res) );