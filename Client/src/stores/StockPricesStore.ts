// store.js
import { create } from 'zustand';

type StockPriceInfo = {
  price: number;
  changePercent: number;
};

type State = {
  stockPrices: { [ticker: string]: StockPriceInfo };
  setStockPrices: (
    ticker: string,
    price: number,
    changePercent: number
  ) => void;
  subscribedTickers: string[];
  setSubscribedTickers: (tickers: string[]) => void;
};

const useStore = create<State>((set) => ({
  stockPrices: {},
  setStockPrices: (ticker, price, changePercent) =>
    set((state) => ({
      stockPrices: { ...state.stockPrices, [ticker]: { price, changePercent } },
    })),
  // ... other states and setters ...
  subscribedTickers: [],
  setSubscribedTickers: (tickers) => set({ subscribedTickers: tickers }),
}));

export default useStore;
