"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarketOpen = void 0;
function isMarketOpen() {
    // Example: Assuming the market is open from 9:30 AM to 4:00 PM EST, Monday to Friday
    const now = new Date(); // Use a library like moment-timezone if you need time zone support
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    // Convert EST market hours to UTC, adjust according to your time zone
    const marketOpenHourUTC = 14; // 9:30 AM EST in UTC
    const marketCloseHourUTC = 21; // 4:00 PM EST in UTC
    return (day >= 1 &&
        day <= 5 &&
        (hour > marketOpenHourUTC ||
            (hour === marketOpenHourUTC && minute >= 30)) &&
        hour < marketCloseHourUTC);
}
exports.isMarketOpen = isMarketOpen;
