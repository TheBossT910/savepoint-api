// Taha Rashid
// May 6, 2025
// managing pos data

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// add to data
const createData = async() => {
    const { error } = await supabase
    .from('pos-data')
    .insert({
        game_id: record.game_id,
        images: record.images,
        condition: record.condition,
        type: record.type,
        price: record.price,
        notes: record.notes,
    });
    console.log( record, error );
};

// retrive from data
const getData = async( id ) => {
    const { data, error } = await supabase
        .from('pos-data')
        .select()
        .eq('id', id);
    return data;
};

// remove from data
const removeData = async( id ) => {
    const { data, error } = await supabase
        .from('pos-data')
        .delete()
        .eq('id', id)
        .select();
    return data;
};