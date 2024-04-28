"use strict";
// import WebSocket from 'ws';
// import { processYahooMessage } from './helpers/processYahooMessage';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocketServer = void 0;
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
const ws_1 = __importDefault(require("ws"));
const processYahooMessage_1 = require("./helpers/processYahooMessage");
const tickerManager = require('./utils/tickerManager');
const YAHOO_WS_URL = 'wss://streamer.finance.yahoo.com';
function setupWebSocketServer(port) {
    const server = new ws_1.default.Server({ port });
    let yahooWs = null;
    server.on('connection', (client) => {
        console.log('Client connected');
        const setupYahooConnection = () => {
            if (!yahooWs) {
                yahooWs = new ws_1.default(YAHOO_WS_URL);
                yahooWs.on('open', () => {
                    console.log('Connected to Yahoo WebSocket');
                });
                yahooWs.on('message', (yahooMessage) => {
                    if (yahooMessage instanceof Buffer) {
                        (0, processYahooMessage_1.processYahooMessage)(yahooMessage.toString(), client);
                    }
                });
                yahooWs.on('close', () => {
                    console.log('Yahoo WebSocket closed');
                    yahooWs = null; // Reset yahooWs to allow reconnection in case of closure
                });
            }
        };
        client.on('message', (message) => {
            setupYahooConnection(); // Ensure Yahoo connection is established
            const data = JSON.parse(message);
            if (yahooWs && yahooWs.readyState === ws_1.default.OPEN) {
                if (data.subscribe) {
                    console.log('Subscribing to:', data.subscribe);
                    tickerManager.addTickers(data.subscribe);
                    yahooWs.send(JSON.stringify({ subscribe: data.subscribe }));
                }
                else if (data.unsubscribe) {
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
exports.setupWebSocketServer = setupWebSocketServer;
