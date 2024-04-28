import WebSocket from 'ws';
import axios from 'axios';
import protobuf from 'protobufjs';

interface decodedData {
  price: number;
  change: number;
  changePercent: number;
  dayVolume: number;
  marketHours: string;
  time: number;
  id: string;
}

const PORT = 8080;
const YAHOO_WS_URL = 'wss://streamer.finance.yahoo.com';

// Load the protobuf definition
const root = protobuf.loadSync('./YPricingData.proto'); // Adjust the path to your .proto file
const Yaticker = root.lookupType('yaticker');

const server = new WebSocket.Server({ port: PORT });

server.on('connection', (client: WebSocket) => {
  console.log('Client connected');
  let yahooWs: WebSocket | null = null;

  client.on('message', (message: string) => {
    const data = JSON.parse(message) as {
      subscribe?: string[];
      unsubscribe?: string[];
    };

    if (!yahooWs) {
      yahooWs = new WebSocket(YAHOO_WS_URL);

      yahooWs.on('open', () => {
        console.log('Connected to Yahoo WebSocket');
        if (data.subscribe) {
          console.log('Subscribing to:', data.subscribe);
          yahooWs?.send(JSON.stringify({ subscribe: data.subscribe }));
        }
      });

      yahooWs.on('message', (yahooMessage: WebSocket.Data) => {
        if (yahooMessage instanceof Buffer) {
          processYahooMessage(yahooMessage.toString(), client);
        }
      });

      yahooWs.on('close', () => {
        console.log('Yahoo WebSocket closed');
      });
    } else {
      if (data.subscribe) {
        console.log('Subscribing to:', data.subscribe);
        yahooWs.send(JSON.stringify({ subscribe: data.subscribe }));
      } else if (data.unsubscribe) {
        console.log('Unsubscribing from:', data.unsubscribe);
        yahooWs.send(JSON.stringify({ unsubscribe: data.unsubscribe }));
      }
    }
  });

  client.on('close', () => {
    console.log('Client disconnected');
    yahooWs?.close();
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);

function processYahooMessage(message: string, client: WebSocket): void {
  try {
    console.log('Received message from Yahoo:', message);
    const decodedProto = Yaticker.decode(base64ToUint8Array(message));
    const decodedData = decodedProto as unknown as decodedData;

    const data = {
      ticker: decodedData.id,
      price: decodedData.price,
      change: decodedData.change,
      changePercent: decodedData.changePercent,
      volume: decodedData.dayVolume,
      marketHours: decodedData.marketHours,
      time: decodedData.time,
    };

    client.send(JSON.stringify(data));
  } catch (error) {
    console.error('Error processing Yahoo message:', error);
  }
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = Buffer.from(base64, 'base64').toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
