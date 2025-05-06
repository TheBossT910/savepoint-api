// Taha Rashid
// April 30, 2025
// API accesss

const api = require('./apis/api')
const express = require('express');

const app = express();
const PORT = 8080;
app.use( express.json() );
app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);

// POST: Create
// GET: Read
// PUT: Update
// DELETE: Delete

// get most popular games of all time
app.get('/products/lists/popular', (req, res) => {
    let response = api.gamesPopular();
    response
        .then( (data) => res.status(200).send(data) );
});

// get currently popular (trending) games
app.get('/products/lists/trending', (req, res) => {
    let response = api.gamesTrending();
    response
        .then( (data) => res.status(200).send(data) );
});

// get highest (most) rated games for specified platform
app.get('/products/lists/highest-rated', (req, res) => {
    let platform = req.query.platform
    let response = api.gamesHighestRated(platform);
    response
        .then( (data) => res.status(200).send(data) );
});

// get game from search on RAWG, query is q
app.get('/tools/rawg-search', (req, res) => {
    let search = req.query.q;

    let response = api.retrieveSearch(search);
    response
        .then( (data) => res.status(200).send( data ));
});

// DEVELOPER ENDPOINTS
// create products
app.get('/developer/create-products', (req, res) => {
    // getting slug and upc
    let slug = req.query.slug;
    let upc = req.query.upc;

    let response = api.createGame(slug, upc);
    response
        .then( (data) => res.status(200).send(data) );
});

// future endpoints to be implemented
// see Postman for docs/info. Do not make them all GET requests (properly implement them!)
app.get('/products/search', (req, res) => {
    return res.status(501).send("/products/search not implemented yet");
});

app.get('/pos/search', (req, res) => {
    return res.status(501).send("/pos/search not implemented yet");
});

app.get('/pos/add', (req, res) => {
    return res.status(501).send("/pos/add not implemented yet");
});

app.get('/pos/remove', (req, res) => {
    return res.status(501).send("/pos/remove not implemented yet");
});

app.get('/tools/image-search', (req, res) => {
    return res.status(501).send("/tools/image-search not implemented yet");
});

app.get('/users/info', (req, res) => {
    let { id } = req.params;
    return res.status(501).send("/users/info not implemented yet");
});

app.get('/stores/info', (req, res) => {
    let { id } = req.params;
    return res.status(501).send("/stores/info not implemented yet");
});