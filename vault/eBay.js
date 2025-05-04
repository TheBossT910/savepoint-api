// Taha Rashid
// May 2, 2025
// eBay scraper

const { chromium } = require('playwright');

// get prices for active/sold listings
const eBayPrices = async (isSold) => {

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // active listings
  let url = 'https://www.ebay.com/sch/i.html?_nkw=super+mario+odyssey&LH_Sold=0&LH_Complete=0';

  // sold/completed listings
  if (isSold) {
    url = 'https://www.ebay.com/sch/i.html?_nkw=super+mario+odyssey&LH_Sold=1&LH_Complete=1';
  }

  // go to webpage
  await page.goto(url);

  // select all items with class for prices
  let prices = await page.locator('css=.s-item__price');

  // select all inner text
  prices.allInnerTexts()
    .then( async (res) => {
        // print text
        console.log(res);
        // close browser instance
        await browser.close();
    });

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


// testing
// productConditions()

