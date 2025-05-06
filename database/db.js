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
        .insert({ record });
};

module.exports = { createProducts };