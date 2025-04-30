// Taha Rashid
// April 30, 2025

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


// GET /test: testing route
app.get('/test', (req, res) => {
    const data = {
        message: "Hello, world!",
        year: 2025
    };

    res.status(200).send( data );
});