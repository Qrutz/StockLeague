import React, { createContext, useContext, useEffect, useState } from 'react';
import useStore from '../stores/StockPricesStore';

// Define the shape of the WebSocket context
interface WebSocketContextType {
  socket: WebSocket | null;
  updateSubscriptions: (newTickers: string[]) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { setStockPrices } = useStore();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setStockPrices(data.ticker, data.price, data.changePercent);
    };

    return () => {
      ws.close();
    };
  }, [setStockPrices]);

  const updateSubscriptions = (newTickers: string[]) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('sending', newTickers);
      socket.send(JSON.stringify({ subscribe: newTickers }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, updateSubscriptions }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketProvider;
