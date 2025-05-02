// Taha Rashid
// May 2, 2025
// testing out Supabase

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// // writing data
// const { errorWrite } = await supabase
//   .from('games')
//   .insert({
//     data: { name: "Taha Rashid" },
//     slug: "taha-rashid",
//     upc: "2006"
//   });

// // updating data
// const { errorUpdate } = await supabase
//   .from('games')
//   .update({ 
//     data: {name: 'Zain Rashid' }
//   })
//   .eq('id', 4);

// We want to read if 1. upc, or 2. slug exists in the db. If it exists, done. If not, then we scrape via external api
// reading data
// slug is a string, upc is represented as an int, so we need a sentinel value of -1 if there is no upc
const databaseRead = async (slug = '', upc = '-1') => {
  // setting empty upc to sentinel -1 value
  if (upc == '') upc = '-1';

  const { data, errorRead } = await supabase
    .from('games')
    .select('data')
    .or(`slug.eq.${slug},upc.eq.${upc}`);
  
  return data;
}

module.exports = { databaseRead };

// testing
// databaseRead('taha-rashid', '')
//   .then( (res) => {
//     if (res == null || res.length == 0) {
//       console.log("no data");
//     } else {
//       console.log(res);
//     }
//   });
