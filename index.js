// Taha Rashid
// April 30, 2025

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