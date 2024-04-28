// latestPrices.js
let latestPrices = {} as LatestPrices;

type data = {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketHours: string;
  time: number;
};

interface LatestPrices {
  [key: string]: data;
}

module.exports = {
  setPrice: (ticker: string, data: data) => {
    latestPrices[ticker] = data;
  },
  getPrice: (ticker: string) => {
    return latestPrices[ticker];
  },
  getAllPrices: () => {
    return latestPrices;
  },
  clearPrices: () => {
    latestPrices = {};
  },
};
