const express = require('express');
const cors = require('cors');

const ToknService = require('./services/toknService');
const SacV1Service = require('./services/SacV1Service');
const SacV2Service = require('./services/SacV2Service');

const {getToknAddress} = require("./services/const");

const app = express();

app.use(cors());

app.get('/tokn/:network/:contractAddress/tokenid/:tokenId', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;
    const tokenId = req.params.tokenId;

    return ToknService.lookupTokenDetails(network, address, tokenId)
        .then((details) => {
            return res.json(details);
        })
        .catch(err => console.log(err));
});

app.get('/tokn/:network/:contractAddress/owner/:owner', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;
    const owner = req.params.owner;

    return ToknService.lookupOwnerDetails(network, address, owner)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/tokn/:network/:contractAddress', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return ToknService.lookupContractDetails(network, address)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/tokn/:network', function (req, res) {
    const network = req.params.network;
    const address = getToknAddress(network);

    return ToknService.lookupContractDetails(network, address)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/:network/:contractAddress', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV1Service.nextHash(network, address)
        .then((result) => {
            res.send(result);
        })
        .catch(err => console.log(err));
});

app.get('/v2/:network/:contractAddress', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV2Service.nextHash(network, address)
        .then((result) => {
            res.send(result);
        })
        .catch(err => console.log(err));
});

app.get('/:network/:contractAddress/json', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV1Service.nextHash(network, address, true)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/v2/:network/:contractAddress/json', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV1Service.nextHash(network, address, true)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/:network/:contractAddress/blocknumber', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV1Service.nextHashAndBlock(network, address)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/v2/:network/:contractAddress/blocknumber', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV2Service.nextHashAndBlock(network, address)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/:network/:contractAddress/details', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV1Service.contractDetails(network, address)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/v2/:network/:contractAddress/details', function (req, res) {
    const address = req.params.contractAddress;
    const network = req.params.network;

    return SacV2Service.contractDetails(network, address)
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get('/:network/sac/:sacAddress/tokn/:toknAddress', function (req, res) {
    const sacAddress = req.params.sacAddress;
    const toknAddress = req.params.toknAddress;
    const network = req.params.network;

    return SacV1Service.nextHash(network, sacAddress)
        .then((hash) => {
            return ToknService.tokenIdOf(network, toknAddress, hash)
                .then((result) => {
                    const tokenId = result.toString(10);
                    return {hash, tokenId};
                });
        })
        .then(({hash, tokenId}) => {
            if (tokenId !== '0') {
                return ToknService.lookupContractDetails(network, toknAddress, tokenId)
                    .then((details) => {
                        return res.json({hash, tokenId, ...details});
                    });
            }
            return res.json({hash, tokenId});
        })
        .catch(err => console.log(err));
});

app.get('/v2/:network/sac/:sacAddress/tokn/:toknAddress', function (req, res) {
    const sacAddress = req.params.sacAddress;
    const toknAddress = req.params.toknAddress;
    const network = req.params.network;

    return SacV2Service.nextHashAndBlock(network, sacAddress)
        .then(({hash, blocknumber}) => {
            return ToknService.tokenIdOf(network, toknAddress, hash)
                .then((result) => {
                    const tokenId = result.toString(10);
                    return {hash, tokenId, blocknumber};
                });
        })
        .then(({hash, tokenId, blocknumber}) => {
            if (tokenId !== '0') {
                return ToknService.lookupContractDetails(network, toknAddress, tokenId)
                    .then((details) => {
                        return res.json({hash, tokenId, blocknumber, ...details});
                    });
            }
            return res.json({hash, tokenId, blocknumber, nickname: "", nicknameRaw: ""});
        })
        .catch(err => console.log(err));
});

// Looks up TOKN address based on network
app.get('/v2/:network/sac/:sacAddress', function (req, res) {
    const sacAddress = req.params.sacAddress;
    const network = req.params.network;
    const toknAddress = getToknAddress(network);

    return SacV2Service.nextHashAndBlock(network, sacAddress)
        .then(({hash, blocknumber}) => {
            return ToknService.tokenIdOf(network, toknAddress, hash)
                .then((result) => {
                    const tokenId = result.toString(10);
                    return {hash, tokenId, blocknumber};
                });
        })
        .then(({hash, tokenId, blocknumber}) => {
            if (tokenId !== '0') {
                return ToknService.lookupContractDetails(network, toknAddress, tokenId)
                    .then((details) => {
                        return res.json({hash, tokenId, blocknumber, ...details});
                    });
            }
            return res.json({hash, tokenId, blocknumber, nickname: "", nicknameRaw: ""});
        })
        .catch(err => console.log(err));
});

// Defaulted to mainnet and short hand version
app.get('/v2/:sacAddress', function (req, res) {
    const sacAddress = req.params.sacAddress;
    const network = 'homestead';
    const toknAddress = getToknAddress(network);

    return SacV2Service.nextHashAndBlock(network, sacAddress)
        .then(({hash, blocknumber}) => {
            return ToknService.tokenIdOf(network, toknAddress, hash)
                .then((result) => {
                    const tokenId = result.toString(10);
                    return {hash, tokenId, blocknumber};
                });
        })
        .then(({hash, tokenId, blocknumber}) => {
            if (tokenId !== '0') {
                return ToknService.lookupContractDetails(network, toknAddress, tokenId)
                    .then((details) => {
                        return res.json({hash, tokenId, blocknumber, ...details});
                    });
            }
            return res.json({hash, tokenId, blocknumber, nickname: "", nicknameRaw: ""});
        })
        .catch(err => console.log(err));
});

app.get('/:network/sac/:sacAddress/tokn/:toknAddress/override/:tokenId', function (req, res) {
    const tokenId = req.params.tokenId;
    const sacAddress = req.params.sacAddress;
    const toknAddress = req.params.toknAddress;
    const network = req.params.network;

    return SacV1Service.nextHash(network, sacAddress)
        .then((hash) => {
            return ToknService.tokenIdOf(network, toknAddress, hash)
                .then((result) => {
                    // const tokenId = result.toString(10);
                    // const tokenId = "3730171";
                    return {hash, tokenId};
                });
        })
        .then(({hash, tokenId}) => {
            if (tokenId !== '0') {
                return ToknService.lookupContractDetails(network, toknAddress, tokenId)
                    .then((details) => {
                        return res.json({hash, tokenId, ...details});
                    });
            }
            return res.json({hash, tokenId});
        })
        .catch(err => console.log(err));
});

app.listen(27264, () => console.log('art-blocks-next-hash-endpoint => listening on http://localhost:27264/'));
