const { ethers } = require('hardhat');

const DECIMAL_PRECISION = 2;

const roundTo2Decimals = (numberToFormat) => {
    return parseFloat(numberToFormat).toFixed(DECIMAL_PRECISION);
}

const formatEtherRoundTo2Decimals = (numberToFormat) => {
    return parseFloat(ethers.utils.formatEther(numberToFormat)).toFixed(DECIMAL_PRECISION);
}

const sleep = (delay) => new Promise((resolve) => {
    console.log("\tSleeping for " + delay + " secs...");
    setTimeout(resolve, delay * 1000)
});

module.exports = { roundTo2Decimals, formatEtherRoundTo2Decimals, sleep }
