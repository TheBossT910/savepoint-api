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

// get game from database
app.get('/games/db', (req, res) => {
    let slug = req.query.slug;
    let upc = req.query.upc;

    let response = api.retrieveDB(slug, upc);
    response
        .then( (data) => res.status(200).send(data) );
});

// get game from search, query is q
app.get('/games/search', (req, res) => {
    let search = req.query.q;

    let response = api.retrieveSearch(search);
    response
        .then( (data) => res.status(200).send( data ));
});

// get most popular games of all time
app.get('/games/lists/popular', (req, res) => {
    let response = api.gamesPopular();
    response
        .then( (data) => res.status(200).send(data) );
});

// get currently popular (trending) games
app.get('/games/lists/trending', (req, res) => {
    let response = api.gamesTrending();
    response
        .then( (data) => res.status(200).send(data) );
});

// get highest (most) rated games for specified platform
app.get('/games/lists/highest-rated', (req, res) => {
    let platform = req.query.platform
    let response = api.gamesHighestRated(platform);
    response
        .then( (data) => res.status(200).send(data) );
});


// TODO: implement
// get users
app.get('/users/:id', (req, res) => {
    let { id } = req.params;
    return res.status(501).send("users/ not implemented yet");
});

// TODO: implement
// get stores
app.get('/stores/:id', (req, res) => {
    let { id } = req.params;
    return res.status(501).send("stores/ not implemented yet");
});