const express = require('express');
const ethers = require('ethers');
const cors = require('cors');

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

const sacAbi = require('./sacAbi');
const toknAbi = require('./toknAbi');

const app = express();

app.use(cors());

app.get('/tokn/:network/:contractAddress/tokenid/:tokenId', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
    const tokenId = req.params.tokenId;
    const contract = new ethers.Contract(address, toknAbi, getProvider(network));

    return Promise.all([
        contract.blockhashOf(tokenId),
        contract.nicknameOf(tokenId),
        contract.ownerOf(tokenId),
        contract.tokenURI(tokenId),
        contract.getApproved(tokenId),
    ])
    .then((result) => {
        res.json({
            blockhash: result[0].toString(10),
            nickname: result[1].toString(10),
            owner: result[2].toString(10),
            tokenURI: result[3].toString(10),
            approved: result[4].toString(10),
        });
    })
    .catch(err => console.log(err));
});

app.get('/tokn/:network/:contractAddress/owner/:owner', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
    const owner = req.params.owner;
    const contract = new ethers.Contract(address, toknAbi, getProvider(network));

    return Promise.all([
        contract.hasTokens(owner),
        contract.tokensOf(owner),
        contract.firstToken(owner),
        contract.balanceOf(owner),
    ])
    .then((result) => {
        res.json({
            hasTokens: result[0].toString(10),
            tokens: result[1].toString(10),
            firstToken: result[2].toString(10),
            balance: result[3].toString(10),
        });
    })
    .catch(err => console.log(err));
});

app.get('/tokn/:network/:contractAddress', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
    const contract = new ethers.Contract(address, toknAbi, getProvider(network));

    return Promise.all([
        contract.name(),
        contract.symbol(),
        contract.owner(),
        contract.costOfToken(),
        contract.purchaseTokenPointer(),
    ])
    .then((result) => {
        res.json({
            name: result[0].toString(10),
            symbol: result[1].toString(10),
            owner: result[2].toString(10),
            costOfToken: result[3].toString(10),
            purchaseTokenPointer: result[4].toString(10),
        });
    })
    .catch(err => console.log(err));
});

app.get('/:network/:contractAddress', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
    const contract = new ethers.Contract(address, sacAbi, getProvider(network));

    return contract.nextHash()
    .then((result) => {
        let hashOnly = result[0];
        res.send(hashOnly);
    })
    .catch(err => console.log(err));
});

app.get('/:network/:contractAddress/json', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
    const contract = new ethers.Contract(address, sacAbi, getProvider(network));

    return contract.nextHash()
    .then((result) => {
        let hashOnly = result[0];
        res.json({hash: hashOnly});
    })
    .catch(err => console.log(err));
});

app.get('/:network/:contractAddress/blocknumber', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
    const contract = new ethers.Contract(address, sacAbi, getProvider(network));

    return contract.nextHash()
    .then((result) => {
        res.json({hash: result[0], blocknumber: result[1].toString(10)});
    })
    .catch(err => console.log(err));
});

app.get('/:network/:contractAddress/details', function (req, res) {

    const address = req.params.contractAddress;
    const network = req.params.network;
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
        res.json({
            pricePerBlockInWei: result[0].toString(10),
            maxBlockPurchaseInOneGo: result[1].toString(10),
            blocknumber: result[2].toString(10),
            lastPurchasedBlock: result[3].toString(10),
            nextPurchasableBlocknumber: result[4].toString(10),
            token: result[5],
            onlyShowPurchased: result[6]
        });
    })
    .catch(err => console.log(err));
});

app.get('/', function (req, res) {
    const address = '0x63093Ed9f978500eeDf57C06C490951708C96a97';
    const contract = new ethers.Contract(address, sacAbi, ropstenProvider);

    return contract.nextHash()
    .then((result) => {
        let hashOnly = result[0];
        res.send(hashOnly);
    })
    .catch(err => console.log(err));
});

app.listen(27264, () => console.log('art-blocks-next-hash-endpoint => listening on http://localhost:27264/'));
