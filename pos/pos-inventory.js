// Taha Rashid
// May 5, 2025
// managing pos inventory

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// add to inventory
const createInventory = async ( record ) => {
    const { error } = await supabase
    .from('pos-inventory')
    .insert({
        store_id: record.store_id,
        game_id: record.game_id,
        data_id: record.data_id,
    });
    console.log( record, error );
};

// retrieve from inventory
const getInventory = async() => {
    const { data, error } = await supabase
        .from('pos-inventory')
        .select()
        .eq('id', id);
    return data;
};  

// remove from inventory
const removeInventory = async () => {
    const { data, error } = await supabase
        .from('pos-inventory')
        .delete()
        .eq('id', id)
        .select();
    return data;
};