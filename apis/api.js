// Taha Rashid
// May 1, 2025
// retrieves data from all APIs and structures into appropriate object

// import functions
const rawg = require('./rawg');
const pricecharting = require('./pricecharting');
const igdb = require('./igdb')
const db = require('../database/products');

// fuzzy search library
const Fuse = require('fuse.js');

const { createData, removeData } = require('../database/pos-data');
const { createInventory, inventoryCondition } = require('../database/pos-inventory');
const { getExistingProducts } = require('../database/products');

// converts game name to slug
// courtesy of ChatGPT (will make own function later, just need to have working product first!)
function slugConverter(gameName) {
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
const formatList =  (res) => {
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
    res = await pricecharting.getValuation(uid)
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
        data.slug = slugConverter(raw.productName);
    }

    data.loose_price = raw.price1;
    data.complete_price = raw.price3;
    data.new_price = raw.price2;

    // getting game data
    res = await igdb.getGame(data.slug)
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
    let res = await rawg.getSearch(search, true);
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

// create and stock to inventory
const createStock = async(storeID, gameID, dataRecord ) => {
    // 1. Create a pos-data record   
    let dataID = await createData( dataRecord );

    // 2. Create a pos-inventory record
    const inventoryRecord = {
        store_id: storeID,
        game_id: gameID,
        data_id: dataID[0].id,
    }
    
    const inventoryID = await createInventory( inventoryRecord )
    // return the inventory id
    return inventoryID;
};

// remove inventory and data records
const removeStock = async(dataID) => {
    // we just need to delete the pos-data record as it will cascade and delete the pos-inventory record automatically
    // returns the removed data record
    return removeData( dataID );
};

const getStockInfo = async(storeID, gameID) => {
    const conditions = ['New', 'Excellent', 'Very Good', 'Good', 'Acceptable'];
    let info = {
        'New': [],
        'Excellent': [],
        'Very Good': [],
        'Good': [],
        'Acceptable': []
    }

    // get the data records that meet the conditions
    for ( let i = 0; i < conditions.length; i++ ) {
        let data = await inventoryCondition(storeID, gameID, conditions[i]);
        info[ conditions[i] ] = data;
    }

    return info;
}

// game lists
// getting popular games
const getListPopular = async () => {
    let res =  await igdb.getListPopular();
    let raw = formatList(res);

    // get slugs for popular products
    let popularSlugs = raw.map( data => data.slug )

    // get slugs for products that are in the database
    let existingProducts = await getExistingProducts(popularSlugs);
    let existingSlugs = existingProducts.map( data => data.slug );

    // get slugs for products that don't exist in the database
    let newSlugs = popularSlugs.filter( slug => !existingSlugs.includes(slug));

    console.log(newSlugs);

    // creating games in database
    let newProducts = [];
    for( const slug of newSlugs ) {
        let product =  await createGame(slug, '-1');
        newProducts.push(product);
    }

    // return all games
    return existingProducts.concat(newProducts);
}

// getting trending games
const getListTrending = async () => {
    let res =  await igdb.getListTrending();
    let raw = formatList(res);
    return raw;
}

// getting highest rated games for specified platform
const getListHighestRated = async (platform) => {
    let res =  await igdb.getListHighestRated(platform);
    let raw = formatList(res);
    return raw;
}

module.exports = { 
    createGame, getGame, 
    createStock, removeStock, stockInfo: getStockInfo, 
    retrieveSearch, 
    getListPopular, getListTrending, getListHighestRated 
};

// DEBUG
// getListPopular()
//     .then( (data) => console.log(data) );