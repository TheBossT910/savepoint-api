// Taha Rashid
// May 2, 2025
// testing out Supabase

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// // reading data
const { data, errorRead } = await supabase
  .from('games')
  .select('data')

console.log(data, errorRead);

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
