// Taha Rashid
// May 2, 2025
// testing out Supabase

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// DEPRECATED
// // slug is a string, upc is represented as an int, so we need a sentinel value of -1 if there is no upc
// const databaseReadGames = async (slug = '', upc = '-1') => {
//   // setting empty upc to sentinel -1 value
//   if (upc == '') upc = '-1';

//   const { data, error } = await supabase
//     .from('games')
//     .select('data')
//     .or(`slug.eq.${slug},upc.eq.${upc}`);
  
//   return data;
// }

// // writes obj to database. If an obj with the same slug exists, it overwrites that obj
// const databaseWriteGames = async (obj) => {
//   const { error } = await supabase
//     .from('games')
//     .upsert( obj, { onConflict: 'slug' } );
// }

// // TODO: create database read/write for users, database read/write for stores when we implement these features!

// module.exports = { databaseReadGames, databaseWriteGames };

// testing
// databaseRead('taha-rashid', '')
//   .then( (res) => {
//     if (res == null || res.length == 0) {
//       console.log("no data");
//     } else {
//       console.log(res);
//     }
//   });
