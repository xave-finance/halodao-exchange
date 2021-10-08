require('@nomiclabs/hardhat-waffle')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  chainId: 1337, // The chain ID number used by Hardhat Network's blockchain. Default value: 31337
  networks: {
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:8545/',
    },
  },
}
