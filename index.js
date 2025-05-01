// Taha Rashid
// April 30, 2025

const api = require('./igdb')
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


// GET /game/:uid
app.get('/game/:uid', (req, res) => {
    let { uid } = req.params

    let response = api.retrieveData(uid); 
    response
        .then( (data) => res.status(200).send( data ));
});