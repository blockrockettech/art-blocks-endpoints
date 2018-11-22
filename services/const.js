const ethers = require('ethers');

const BR_INFURA_API_TOKEN = 'anraJ8h3jfIwcoBEwkgH';

const homesteadProvider = new ethers.providers.InfuraProvider('homestead', BR_INFURA_API_TOKEN);
const ropstenProvider = new ethers.providers.InfuraProvider('ropsten', BR_INFURA_API_TOKEN);
const rinkebyProvider = new ethers.providers.InfuraProvider('rinkeby', BR_INFURA_API_TOKEN);

const getProvider = (networkName) => {
    let provider;
    switch (networkName) {
        case 'homestead':
            provider = homesteadProvider;
            break;
        case 'ropsten':
            provider = ropstenProvider;
            break;
        case 'rinkeby':
            provider = rinkebyProvider;
            break;
        default:
            throw new Error('unsupported network');
    }

    return provider;
};

const getToknAddress = (networkName) => {
    switch (networkName) {
        case 'homestead':
            return "0x7f737b66921d18b008dc9c3a9b933a3bf559f1bc";
        case 'ropsten':
            return "0x17a316a4e3f7d3c0289b78973c411ba47f1e8290";
        case 'rinkeby':
            return "0x5f21597c2f0ec42ec0738a9b85534eca362f5645";
        default:
            throw new Error('unsupported network');
    }
};

module.exports = {
    getProvider,
    getToknAddress,
    BR_INFURA_API_TOKEN
};
