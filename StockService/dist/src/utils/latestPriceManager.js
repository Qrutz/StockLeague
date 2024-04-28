"use strict";
// latestPrices.js
let latestPrices = {};
module.exports = {
    setPrice: (ticker, data) => {
        latestPrices[ticker] = data;
    },
    getPrice: (ticker) => {
        return latestPrices[ticker];
    },
    getAllPrices: () => {
        return latestPrices;
    },
    clearPrices: () => {
        latestPrices = {};
    },
};
