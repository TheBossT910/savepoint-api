// Taha Rashid
// May 2, 2025
// eBay scraper

const { chromium } = require('playwright');

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

// TODO: Need to do math to find non-outliers and average them out to get a pricing estimate
// Won't use productConditions() for now...
// Also need to be able to switch between the different keywords (disc+only, cartridge+only, etc.)
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

  let resLoose = await eBayPrices(urlLoose);
  let resComplete = await eBayPrices(urlComplete);
  let resNew = await eBayPrices(urlNew);

  // console.log(res); // results
  // console.log(res.length);  // number of results

  let averageLoose = resLoose.reduce( (accumulator, currentValue) => accumulator + currentValue ) / resLoose.length;
  let averageComplete = resComplete.reduce( (accumulator, currentValue) => accumulator + currentValue ) / resComplete.length;
  let averageNew = resNew.reduce( (accumulator, currentValue) => accumulator + currentValue ) / resNew.length;

  console.log(`Loose price: ${averageLoose}`);
  console.log(`Complete price: ${averageComplete}`);
  console.log(`New price: ${averageNew}`);
}

// testing
// productConditions();
productValuation()

