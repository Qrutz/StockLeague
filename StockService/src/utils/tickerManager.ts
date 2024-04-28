const subscribedTickers = new Set();

type tickers = string[];

module.exports.addTickers = (tickers: tickers) => {
  tickers.forEach((ticker) => subscribedTickers.add(ticker));
};

module.exports.removeTickers = (tickers: tickers) => {
  tickers.forEach((ticker) => subscribedTickers.delete(ticker));
};

module.exports.getSubscribedTickers = () => {
  return Array.from(subscribedTickers);
};
