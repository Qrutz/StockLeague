"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToUint8Array = void 0;
function base64ToUint8Array(base64) {
    const binaryString = Buffer.from(base64, 'base64').toString('binary');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
exports.base64ToUint8Array = base64ToUint8Array;
