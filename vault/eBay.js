// Taha Rashid
// May 2, 2025
// eBay scraper

const { chromium } = require('playwright');

// Function to filter out outliers in an array of data
// Courtesy of StackOverflow, https://stackoverflow.com/questions/20811131/javascript-remove-outlier-from-an-array
function filterOutliers(someArray) {  

  // Copy the values, rather than operating on references to existing values
  var values = someArray.concat();

  // Then sort
  values.sort( function(a, b) {
          return a - b;
       });

  /* Then find a generous IQR. This is generous because if (values.length / 4) 
   * is not an int, then really you should average the two elements on either 
   * side to find q1.
   */     
  var q1 = values[Math.floor((values.length / 4))];
  // Likewise for q3. 
  var q3 = values[Math.ceil((values.length * (3 / 4)))];
  var iqr = q3 - q1;

  // Then find min and max values
  var maxValue = q3 + iqr*1.5;
  var minValue = q1 - iqr*1.5;

  // Then filter anything beyond or beneath these values.
  var filteredValues = values.filter(function(x) {
      return (x <= maxValue) && (x >= minValue);
  });

  // Then return
  return filteredValues;
}


// get prices for active/sold listings
const eBayPrices = async (url) => {

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // // active listings
  // let url = 'https://www.ebay.com/sch/i.html?_nkw=super+mario+odyssey&LH_Sold=0&LH_Complete=0';

  // // sold/completed listings
  // if (isSold) {
  //   url = 'https://www.ebay.com/sch/i.html?_nkw=super+mario+odyssey&LH_Sold=1&LH_Complete=1';
  // }

  // go to webpage
  await page.goto(url);

  // select all items with class for prices
  let prices = await page.locator('css=.s-item__price');

  // select all inner text
  let res = await prices.allInnerTexts()
  // remove prices with ranges
  let filteredPrices = res.filter( (res) => !res.includes("to"));
  // remove $ sign and convert to float
  filteredPrices = res.map( (res) => parseFloat(res.substring(1)) );
  
  // close broswer instance and return data
  await browser.close();
  return filteredPrices;
  // return res;
};

// getting all condition options
const productConditions = async () => {

    const browser = await chromium.launch();
    const page = await browser.newPage();
  
    let url = 'https://www.ebay.com/sch/i.html?_nkw=super+mario+odyssey&LH_Sold=0&LH_Complete=0';
  
    // go to webpage
    await page.goto(url);
  
    // select the 'Condition' category
    let main = await page.locator('.x-refine__main__list').filter({ hasText: 'Condition' })    // main
    let categories = await main.locator('.x-refine__main__list--value .cbx.x-refine__multi-select-link');

    // select all inner text
    // categories.innerHTML
    // categories.first().getAttribute('href')
    //     .then( (res) => console.log(res) );

    // select all inner text
    for (let i = 0; i < await categories.count(); i++) {
        let current = categories.nth(i);
    
        let conditionCode = await current.getAttribute('href');
        // only keep the condition code
        conditionCode = conditionCode.split('LH_ItemCondition=')
        conditionCode = conditionCode[conditionCode.length - 1];

        let conditionName = await current.innerText();
        // only keep the condition name and no other text
        conditionName = conditionName.split('\n')[0];

        console.log(`${conditionName.split('\n')[0]} - ${conditionCode}`);
    }

    await browser.close(); 
  };

// TODO: need to be able to switch between the different keywords (disc+only, cartridge+only, etc.)
// need to format numbers to pricing format
// Won't use productConditions() for now...
const productValuation = async (upcArr) => {
  // let upc = '045496590741';  // Super Mario Odyssey
  let upc = '711719547518';     // Ghost of Tsushima

  // keywords for condition searches
  let looseSearch = `${upc}+disc+only`;  // cartridge+only or disc+only or game+only
  let looseExclusion = 'cib+complete+sealed+new+brand+manual+box+case+boxed+like+mint+condition+great+excellent+includes+included+bundle+set+collection';

  let completeSearch = `${upc}+complete`;  // cib or complete
  let compelteExclusion = '';

  let newSearch = `${upc}+new`; // new or sealed
  let newExclusion = '';

  // creating url 
  let urlLoose = `https://www.ebay.com/sch/i.html?_nkw=${looseSearch}&_in_kw=1&LH_Sold=1&LH_Complete=1&_ipg=240&_ex_kw=${looseExclusion}`;
  let urlComplete = `https://www.ebay.com/sch/i.html?_nkw=${completeSearch}&_in_kw=1&LH_Sold=1&LH_Complete=1&_ipg=240&_ex_kw=${compelteExclusion}`;
  let urlNew = `https://www.ebay.com/sch/i.html?_nkw=${newSearch}&_in_kw=1&LH_Sold=1&LH_Complete=1&_ipg=240&_ex_kw=${newExclusion}`;

  // grabbing prices and removing outliers
  let resLoose = filterOutliers( await eBayPrices(urlLoose) );
  let resComplete = filterOutliers( await eBayPrices(urlComplete) );
  let resNew = filterOutliers( await eBayPrices(urlNew) );

  // getting the average value
  let averageLoose = resLoose.reduce( (accumulator, currentValue) => accumulator + currentValue ) / resLoose.length;
  let averageComplete = resComplete.reduce( (accumulator, currentValue) => accumulator + currentValue ) / resComplete.length;
  let averageNew = resNew.reduce( (accumulator, currentValue) => accumulator + currentValue ) / resNew.length;

  // console.log(`Loose price: ${averageLoose}`);
  // console.log(`Complete price: ${averageComplete}`);
  // console.log(`New price: ${averageNew}`);

  // returning results
  return {'loose': averageLoose, 'complete': averageComplete, 'new':averageNew};
}

// testing
// productConditions();
// productValuation()
//   .then( (res) => {
//     console.log(`Loose price: ${res.loose}`);
//     console.log(`Complete price: ${res.complete}`);
//     console.log(`New price: ${res.new}`);
//   });