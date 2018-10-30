const {getProvider} = require("./const");

const ethers = require('ethers');
const utils = ethers.utils;

const toknAbi = require('../abi/toknAbi');

class ToknService {

    static tokenIdOf(network, address, hash) {
        const contract = new ethers.Contract(address, toknAbi, getProvider(network));
        return contract.tokenIdOf(hash)
            .then((result) => {
                return result.toString(10);
            });
    }

    static lookupTokenDetails(network, address, tokenId) {
        const contract = new ethers.Contract(address, toknAbi, getProvider(network));
        return Promise.all([
            contract.blockhashOf(tokenId),
            contract.nicknameOf(tokenId),
            contract.ownerOf(tokenId),
            contract.tokenURI(tokenId),
            contract.getApproved(tokenId),
        ])
            .then((result) => {
                let nicknameRaw = result[1].toString(10);
                return {
                    blockhash: result[0].toString(10),
                    nicknameRaw,
                    nickname: utils.toUtf8String(nicknameRaw).replace(/\0.*$/g, ''),
                    owner: result[2].toString(10),
                    tokenURI: result[3].toString(10),
                    approved: result[4].toString(10),
                };
            });
    }

    static lookupOwnerDetails(network, address, owner) {
        const contract = new ethers.Contract(address, toknAbi, getProvider(network));
        return Promise.all([
            contract.hasTokens(owner),
            contract.tokensOf(owner),
            contract.firstToken(owner),
            contract.balanceOf(owner),
        ])
            .then((result) => {
                return {
                    hasTokens: result[0].toString(10),
                    tokens: result[1].toString(10),
                    firstToken: result[2].toString(10),
                    balance: result[3].toString(10),
                };
            });
    }

    static lookupContractDetails(network, address) {
        const contract = new ethers.Contract(address, toknAbi, getProvider(network));
        return Promise.all([
            contract.name(),
            contract.symbol(),
            contract.owner(),
            contract.costOfToken(),
            contract.purchaseTokenPointer(),
        ])
            .then((result) => {
                return {
                    name: result[0].toString(10),
                    symbol: result[1].toString(10),
                    owner: result[2].toString(10),
                    costOfToken: result[3].toString(10),
                    purchaseTokenPointer: result[4].toString(10),
                };
            });
    }
}

module.exports = ToknService;
