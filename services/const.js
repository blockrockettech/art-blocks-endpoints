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

module.exports = {
    getProvider,
    BR_INFURA_API_TOKEN
};
