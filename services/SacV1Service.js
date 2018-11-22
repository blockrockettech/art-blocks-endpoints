const {getProvider} = require("./const");

const ethers = require('ethers');

const sacAbi = require('../abi/sac-v1-abi');

class SacV1Service {

    static nextHash(network, address, json = false) {
        const contract = new ethers.Contract(address, sacAbi, getProvider(network));
        return contract.nextHash()
            .then((result) => {
                let hashOnly = result[0];
                return json ? {hash: hashOnly} : hashOnly;
            });
    }

    static nextHashAndBlock(network, address) {
        const contract = new ethers.Contract(address, sacAbi, getProvider(network));
        return Promise.all([
            contract.nextHash(),
            contract.blocknumber()
        ])
            .then((result) => {
                return {
                    hash: result[0][0],
                    blocknumber: result[1].toString(10)
                };
            });
    }

    static contractDetails(network, address) {
        const contract = new ethers.Contract(address, sacAbi, getProvider(network));
        return Promise.all([
            contract.pricePerBlockInWei(),
            contract.maxBlockPurchaseInOneGo(),
            contract.blocknumber(),
            contract.lastPurchasedBlock(),
            contract.nextPurchasableBlocknumber(),
            contract.token(),
            contract.onlyShowPurchased()
        ])
            .then((result) => {
                return {
                    pricePerBlockInWei: result[0].toString(10),
                    maxBlockPurchaseInOneGo: result[1].toString(10),
                    blocknumber: result[2].toString(10),
                    lastPurchasedBlock: result[3].toString(10),
                    nextPurchasableBlocknumber: result[4].toString(10),
                    token: result[5],
                    onlyShowPurchased: result[6]
                };
            });
    }

}

module.exports = SacV1Service;
