import WebSocket from 'ws';
import protobuf from 'protobufjs';
import { base64ToUint8Array } from '../utils/utils';
const latestPrices = require('../utils/latestPriceManager');

interface decodedData {
  price: number;
  change: number;
  changePercent: number;
  dayVolume: number;
  marketHours: string;
  time: number;
  id: string;
}
// Load the protobuf definition
const root = protobuf.loadSync('./YPricingData.proto'); // Adjust the path
const Yaticker = root.lookupType('yaticker');

export function processYahooMessage(message: string, client: WebSocket): void {
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

    latestPrices.setPrice(data.ticker, {
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: data.volume,
      marketHours: data.marketHours,
      time: data.time,
    });
  } catch (error) {
    console.error('Error processing Yahoo message:', error);
  }
}
