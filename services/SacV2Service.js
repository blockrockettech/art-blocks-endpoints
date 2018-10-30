const {getProvider} = require("./const");

const ethers = require('ethers');

const sacAbi = require('../abi/sac-v2-abi');

class SacV2Service {

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
            contract.nextHash()
        ])
            .then((result) => {
                return {
                    hash: result[0][0],
                    blocknumber: result[0][1].toString(10)
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
            contract.onlyShowPurchased(),
            contract.applicationChecksum(),
            contract.maxInvocations(),
            contract.totalInvocations(),
            contract.remainingInvocations(),
            contract.preventDoublePurchases(),
            contract.fixedContract(),
        ])
            .then((result) => {
                return {
                    pricePerBlockInWei: result[0].toString(10),
                    maxBlockPurchaseInOneGo: result[1].toString(10),
                    blocknumber: result[2].toString(10),
                    lastPurchasedBlock: result[3].toString(10),
                    nextPurchasableBlocknumber: result[4].toString(10),
                    token: result[5],
                    onlyShowPurchased: result[6],
                    applicationChecksum: result[7],
                    maxInvocations: result[8],
                    totalInvocations: result[9],
                    remainingInvocations: result[10],
                    preventDoublePurchases: result[11],
                    fixedContract: result[12],
                };
            });
    }

}

module.exports = SacV2Service;
