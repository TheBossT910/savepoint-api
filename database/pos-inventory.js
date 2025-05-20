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

// retrieve products that match the given condition
const inventoryCondition = async( storeID, gameID, condition ) => {
    const { data, error } = await supabase
    .from('pos-inventory')
    .select('*, pos-data!inner(*)')
    .eq('store_id', storeID)                // match the store_id
    .eq('game_id', gameID)                  // match the game_id
    .eq('pos-data.condition', condition);   // match the condition
    return data;
}

// returns all products from a specific store
const getAllInventory = async ( storeID ) => {
    const { data, error } = await supabase
        .from('pos-inventory')
        .select('game_id, pos-data!inner(type, condition), products!inner(cover, name)')
        .eq('store_id', storeID);

    let formattedInventory = {};
    for (const product of data) {
        // destructure data
        let gameID = product.game_id
        let { type, condition } = product['pos-data']
        let { name, cover } = product.products

        // creates the product if it does not exist
        if ( !(gameID in formattedInventory) ) {
            formattedInventory[gameID] = {
                type: {
                    'New': 0,
                    'Complete': 0,
                    'Loose': 0,
                    'Parts': 0
                },
                condition: {
                    'New': 0,
                    'Excellent': 0,
                    'Very Good': 0,
                    'Good': 0,
                    'Acceptable': 0
                },
                info: {
                    'name': name,
                    'cover': cover
                }
            }
        }

        // add data to array
        formattedInventory[gameID]['type'][type]++
        formattedInventory[gameID]['condition'][condition]++
    }

    return formattedInventory
}

module.exports = { createInventory, getInventory, removeInventory, inventoryCondition, getAllInventory };

// testing
// const record = {
//     store_id: '8fea0411-e4f4-4394-82a5-b703ba71f2cd',
//     game_id: '0f6afa57-2eb8-4969-9f32-ebf7f537548b',
//     data_id: '9b3aeec6-ed7f-43c7-96d5-255a5362c161',
// }

// createInventory( record )
//     .then( (res) => console.log(res) );

// inventoryCondition('8fea0411-e4f4-4394-82a5-b703ba71f2cd', 'c1866624-675e-429b-b0cc-b2f354906c95', 'New')
//     .then( (res) => console.log(res) );

// getAllInventory( '8fea0411-e4f4-4394-82a5-b703ba71f2cd' )
//     .then( (data) => console.log(data) );