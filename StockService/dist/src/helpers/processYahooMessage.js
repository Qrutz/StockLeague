"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processYahooMessage = void 0;
const protobufjs_1 = __importDefault(require("protobufjs"));
const utils_1 = require("../utils/utils");
const latestPrices = require('../utils/latestPriceManager');
// Load the protobuf definition
const root = protobufjs_1.default.loadSync('./YPricingData.proto'); // Adjust the path
const Yaticker = root.lookupType('yaticker');
function processYahooMessage(message, client) {
    try {
        console.log('Received message from Yahoo:', message);
        const decodedProto = Yaticker.decode((0, utils_1.base64ToUint8Array)(message));
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
        latestPrices.setPrice(data.ticker, {
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            volume: data.volume,
            marketHours: data.marketHours,
            time: data.time,
        });
    }
    catch (error) {
        console.error('Error processing Yahoo message:', error);
    }
}
exports.processYahooMessage = processYahooMessage;
