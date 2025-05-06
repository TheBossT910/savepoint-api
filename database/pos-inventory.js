// Taha Rashid
// May 5, 2025
// managing pos inventory

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// add to inventory
const createInventory = async ( record ) => {
    const { data, error } = await supabase
    .from('pos-inventory')
    .insert({
        store_id: record.store_id,
        game_id: record.game_id,
        data_id: record.data_id,
    })
    .select('id')
    console.log( error );
    return data;
};

// retrieve from inventory
const getInventory = async( id ) => {
    const { data, error } = await supabase
        .from('pos-inventory')
        .select()
        .eq('id', id);
    return data;
};  

// remove from inventory
const removeInventory = async ( id ) => {
    const { data, error } = await supabase
        .from('pos-inventory')
        .delete()
        .eq('id', id)
        .select();
    return data;
};

// testing
// const record = {
//     store_id: '8fea0411-e4f4-4394-82a5-b703ba71f2cd',
//     game_id: '0f6afa57-2eb8-4969-9f32-ebf7f537548b',
//     data_id: '9b3aeec6-ed7f-43c7-96d5-255a5362c161',
// }

// createInventory( record )
//     .then( (res) => console.log(res) );