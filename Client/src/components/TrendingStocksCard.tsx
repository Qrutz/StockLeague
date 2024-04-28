import { useEffect } from 'react';
import RightSideCard from './RightSideCard';
import TickerListitem from './TickerListComponent';
import { useWebSocket } from '@/contexts/WebSocketContext';
import useStore from '@/stores/StockPricesStore';

export default function TrendingStocksCard() {
  const { updateSubscriptions } = useWebSocket();
  const { stockPrices } = useStore();

  const trendingTickerExample = [
    {
      ticker: 'BTC-USD',
      companyName: 'Bitcoin',
      currentPrice: '$51,393.11',
      ranking: 1,
      movement: 0.73,
    },
    {
      ticker: 'LINK-USD',
      companyName: 'Apple Inc.',
      currentPrice: '$125.90',
      ranking: 2,
      movement: -0.12,
    },
    {
      ticker: 'XRP-USD',
      companyName: 'Tesla Inc.',
      currentPrice: '$660.00',
      ranking: 3,
      movement: 0.25,
    },
    {
      ticker: 'SHIB-USD',
      companyName: 'Amazon.com Inc.',
      currentPrice: '$3,372.20',
      ranking: 4,
      movement: -0.34,
    },
    {
      ticker: 'GOOGL',
      companyName: 'Alphabet Inc.',
      currentPrice: '$2,030.00',
      ranking: 5,
      movement: 0.45,
    },
  ];

  useEffect(() => {
    const tickers = trendingTickerExample
      .map((ticker) => ticker.ticker)
      .filter((v, i, a) => a.indexOf(v) === i);
    updateSubscriptions(tickers);
  }, [updateSubscriptions, trendingTickerExample]);

  return (
    <RightSideCard title='Trending tickers' viewMore='/trending'>
      <div className='space-y-2 dark:space-y-1'>
        {trendingTickerExample.map((ticker, index) => (
          <TickerListitem
            key={index}
            ticker={ticker.ticker}
            companyName={ticker.companyName}
            currentPrice={stockPrices[ticker.ticker]?.price || 0}
            ranking={ticker.ranking}
            movement={stockPrices[ticker.ticker]?.changePercent || 0}
          />
        ))}
      </div>
    </RightSideCard>
  );
}
