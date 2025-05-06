// Taha Rashid
// May 6, 2025
// managing pos data

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// add to data
const createData = async() => {

};

// retrive from data
const getData = async() => {

};

// remove from data
const removeData = async() => {

};