// import WebSocket from 'ws';
// import { processYahooMessage } from './helpers/processYahooMessage';

// const YAHOO_WS_URL = 'wss://streamer.finance.yahoo.com';

// export function setupWebSocketServer(port: number): void {
//   const server = new WebSocket.Server({ port });

//   server.on('connection', (client: WebSocket) => {
//     console.log('Client connected');
//     let yahooWs: WebSocket | null = null;

//     client.on('message', (message: string) => {
//       const data = JSON.parse(message) as {
//         subscribe?: string[];
//         unsubscribe?: string[];
//       };

//       if (!yahooWs) {
//         yahooWs = new WebSocket(YAHOO_WS_URL);

//         yahooWs.on('open', () => {
//           console.log('Connected to Yahoo WebSocket');
//           if (data.subscribe) {
//             console.log('Subscribing to:', data.subscribe);
//             yahooWs?.send(JSON.stringify({ subscribe: data.subscribe }));
//           }
//         });

//         yahooWs.on('message', (yahooMessage: WebSocket.Data) => {
//           if (yahooMessage instanceof Buffer) {
//             processYahooMessage(yahooMessage.toString(), client);
//           }
//         });

//         yahooWs.on('close', () => {
//           console.log('Yahoo WebSocket closed');
//         });
//       } else {
//         if (data.subscribe) {
//           console.log('Subscribing to:', data.subscribe);
//           yahooWs.send(JSON.stringify({ subscribe: data.subscribe }));
//         } else if (data.unsubscribe) {
//           console.log('Unsubscribing from:', data.unsubscribe);
//           yahooWs.send(JSON.stringify({ unsubscribe: data.unsubscribe }));
//         }
//       }
//     });

//     client.on('close', () => {
//       console.log('Client disconnected');
//       yahooWs?.close();
//     });
//   });

//   console.log(`WebSocket server started on ws://localhost:${port}`);
// }
import WebSocket from 'ws';
import { processYahooMessage } from './helpers/processYahooMessage';
const tickerManager = require('./utils/tickerManager');

const YAHOO_WS_URL = 'wss://streamer.finance.yahoo.com';

export function setupWebSocketServer(port: number): void {
  const server = new WebSocket.Server({ port });
  let yahooWs: WebSocket | null = null;

  server.on('connection', (client: WebSocket) => {
    console.log('Client connected');

    const setupYahooConnection = () => {
      if (!yahooWs) {
        yahooWs = new WebSocket(YAHOO_WS_URL);

        yahooWs.on('open', () => {
          console.log('Connected to Yahoo WebSocket');
        });

        yahooWs.on('message', (yahooMessage: WebSocket.Data) => {
          if (yahooMessage instanceof Buffer) {
            processYahooMessage(yahooMessage.toString(), client);
          }
        });

        yahooWs.on('close', () => {
          console.log('Yahoo WebSocket closed');
          yahooWs = null; // Reset yahooWs to allow reconnection in case of closure
        });
      }
    };

    client.on('message', (message: string) => {
      setupYahooConnection(); // Ensure Yahoo connection is established

      const data = JSON.parse(message) as {
        subscribe?: string[];
        unsubscribe?: string[];
      };

      if (yahooWs && yahooWs.readyState === WebSocket.OPEN) {
        if (data.subscribe) {
          console.log('Subscribing to:', data.subscribe);
          tickerManager.addTickers(data.subscribe);
          yahooWs.send(JSON.stringify({ subscribe: data.subscribe }));
        } else if (data.unsubscribe) {
          console.log('Unsubscribing from:', data.unsubscribe);
          yahooWs.send(JSON.stringify({ unsubscribe: data.unsubscribe }));
        }
      }
    });

    client.on('close', () => {
      console.log('Client disconnected');
      // Do not close yahooWs here as it is shared among all clients
    });
  });

  console.log(`WebSocket server started on ws://localhost:${port}`);
}
