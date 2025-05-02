// Taha Rashid
// April 30, 2025
// API accesss

const api = require('./apis/retrieveData')
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


// get game from upc
app.get('/games/upc/:upc', (req, res) => {
    let { upc } = req.params

    let response = api.retrieveData(upc, false);
    response
        .then( (data) => res.status(200).send( data ));
});

// get game from search, query is q
app.get('/games/search', (req, res) => {
    let search = req.query.q;

    let response = api.retrieveSearch(search);
    response
        .then( (slug) => api.retrieveData(slug, true) )
        .then( (data) => res.status(200).send( data ));
});


app.get('/games/lists/popular', (req, res) => {
    return res.status(501).send("games/popular not implemented yet");
});

app.get('/games/lists/trending', (req, res) => {
    return res.status(501).send("games/trending not implemented yet");
});

// get users
app.get('/users/:id', (req, res) => {
    let { id } = req.params;
    return res.status(501).send("users/ not implemented yet");
});

// get stores
app.get('/stores/:id', (req, res) => {
    let { id } = req.params;
    return res.status(501).send("stores/ not implemented yet");
});