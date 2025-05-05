// Taha Rashid
// May 5, 2025
// formatting prices 

// Courtesy of ChatGPT, will make my own
// This was just proof of concept, my own function will be structured completely differently
function calculatePricing({
    targetPrice,
    onlineFeeRate = 0.13,      // eBay + PayPal
    inPersonFeeRate = 0.027,   // Stripe Terminal
    desiredProfitMargin = 0.2, // 20%
    storeOverhead = 0.1,       // 10% markup for in-store
  }) {
    // Online pricing
    const onlineFeeAmount = targetPrice * onlineFeeRate;
    const onlineProfit = targetPrice * desiredProfitMargin;
    const maxAcquisitionOnline = targetPrice - onlineFeeAmount - onlineProfit;
  
    // In-store pricing
    const inStorePrice = targetPrice + (targetPrice * storeOverhead);
    const inStoreFeeAmount = inStorePrice * inPersonFeeRate;
    const inStoreProfit = inStorePrice * desiredProfitMargin;
    const maxAcquisitionInStore = inStorePrice - inStoreFeeAmount - inStoreProfit;
  
    return {
      online: {
        listPrice: Number(targetPrice.toFixed(2)),
        feeAmount: Number(onlineFeeAmount.toFixed(2)),
        maxAcquisitionCost: Number(maxAcquisitionOnline.toFixed(2)),
        expectedProfit: Number(onlineProfit.toFixed(2)),
      },
      inStore: {
        listPrice: Number(inStorePrice.toFixed(2)),
        feeAmount: Number(inStoreFeeAmount.toFixed(2)),
        maxAcquisitionCost: Number(maxAcquisitionInStore.toFixed(2)),
        expectedProfit: Number(inStoreProfit.toFixed(2)),
      },
    };
  }

const price = calculatePricing({ targetPrice: 130.9254237288135 });
console.log(price);