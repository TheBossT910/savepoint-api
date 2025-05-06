// Taha Rashid
// May 5, 2025
// managing pos

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// add to pos
const createInventory = async () => {

};

// retrieve from pos
const getInventory = async() => {

};  

// remove from pos
const removeInventory = async () => {

};