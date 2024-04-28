import { SortContext } from '@/contexts/SortFilterContext';
import { useContext } from 'react';

export const useSort = () => {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSort must be used within a SortProvider');
  }
  return context;
};
