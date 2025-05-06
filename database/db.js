// Taha Rashid
// May 2, 2025
// testing out Supabase

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// creates a new record in 'products' table
const createProducts = async ( record ) => {
    const { error } = await supabase
        .from('products')
        .insert({
            slug: record.slug,
            upc: record.upc,
            name: record.name,
            cover: record.cover,
            media: record.media,
            description: record.description,
            release_date: record.release_date,
            price_new: record.price_new,
            price_complete: record.price_complete,
            price_loose: record.price_loose,
            price_last_updated: record.price_last_updated,
        });
};

module.exports = { createProducts };