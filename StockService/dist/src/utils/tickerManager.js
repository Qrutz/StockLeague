"use strict";
const subscribedTickers = new Set();
module.exports.addTickers = (tickers) => {
    tickers.forEach((ticker) => subscribedTickers.add(ticker));
};
module.exports.removeTickers = (tickers) => {
    tickers.forEach((ticker) => subscribedTickers.delete(ticker));
};
module.exports.getSubscribedTickers = () => {
    return Array.from(subscribedTickers);
};
