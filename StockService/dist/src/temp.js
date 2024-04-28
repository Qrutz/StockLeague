"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const protobufjs_1 = __importDefault(require("protobufjs"));
const PORT = 8080;
const YAHOO_WS_URL = 'wss://streamer.finance.yahoo.com';
// Load the protobuf definition
const root = protobufjs_1.default.loadSync('./YPricingData.proto'); // Adjust the path to your .proto file
const Yaticker = root.lookupType('yaticker');
const server = new ws_1.default.Server({ port: PORT });
server.on('connection', (client) => {
    console.log('Client connected');
    let yahooWs = null;
    client.on('message', (message) => {
        const data = JSON.parse(message);
        if (!yahooWs) {
            yahooWs = new ws_1.default(YAHOO_WS_URL);
            yahooWs.on('open', () => {
                console.log('Connected to Yahoo WebSocket');
                if (data.subscribe) {
                    console.log('Subscribing to:', data.subscribe);
                    yahooWs === null || yahooWs === void 0 ? void 0 : yahooWs.send(JSON.stringify({ subscribe: data.subscribe }));
                }
            });
            yahooWs.on('message', (yahooMessage) => {
                if (yahooMessage instanceof Buffer) {
                    processYahooMessage(yahooMessage.toString(), client);
                }
            });
            yahooWs.on('close', () => {
                console.log('Yahoo WebSocket closed');
            });
        }
        else {
            if (data.subscribe) {
                console.log('Subscribing to:', data.subscribe);
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
        yahooWs === null || yahooWs === void 0 ? void 0 : yahooWs.close();
    });
});
console.log(`WebSocket server started on ws://localhost:${PORT}`);
function processYahooMessage(message, client) {
    try {
        console.log('Received message from Yahoo:', message);
        const decodedProto = Yaticker.decode(base64ToUint8Array(message));
        const decodedData = decodedProto;
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
    }
    catch (error) {
        console.error('Error processing Yahoo message:', error);
    }
}
function base64ToUint8Array(base64) {
    const binaryString = Buffer.from(base64, 'base64').toString('binary');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
