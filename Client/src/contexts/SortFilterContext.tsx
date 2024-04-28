import { useQueryClient } from '@tanstack/react-query';
import React, { ReactNode, createContext, useState } from 'react';

type SortType = 'All' | 'Watchlist' | 'Trending';
export type TickerType = string | null;

interface SortState {
  type: SortType;
  ticker: TickerType;
}

interface SortContextType {
  sort: SortState;
  updateSortType: (newSort: SortType) => void;
  updateTicker: (ticker: TickerType) => void;
}

export const SortContext = createContext<SortContextType | undefined>(
  undefined
);

export const SortProvider = ({ children }: { children: ReactNode }) => {
  const [sort, setSort] = useState<SortState>({ type: 'All', ticker: null });
  const queryClient = useQueryClient();

  const updateSortType = (newSort: SortType) => {
    setSort((prev) => ({ ...prev, type: newSort }));
    queryClient.invalidateQueries('timeline');
  };

  // update ticker
  const updateTicker = (ticker: TickerType) => {
    setSort((prev) => ({ ...prev, ticker }));
  };

  return (
    <SortContext.Provider value={{ sort, updateSortType, updateTicker }}>
      {children}
    </SortContext.Provider>
  );
};
