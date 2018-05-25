const express = require('express');
const ethers = require('ethers');

const BR_INFURA_API_TOKEN = 'anraJ8h3jfIwcoBEwkgH';

const provider = new ethers.providers.InfuraProvider('ropsten', BR_INFURA_API_TOKEN);

const abi = '[{"constant":true,"inputs":[],"name":"blocknumber","outputs":[{"name":"_blockNumber","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_blockNumber","type":"uint256"}],"name":"tokenIdOf","outputs":[{"name":"_tokenId","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_blocknumber","type":"uint256"}],"name":"getPurchasedBlockhash","outputs":[{"name":"_tokenHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nextPurchasableBlocknumber","outputs":[{"name":"_nextFundedBlock","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nextHash","outputs":[{"name":"_tokenHash","type":"bytes32"},{"name":"_nextBlocknumber","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_blocknumber","type":"uint256"}],"name":"nativeBlockhash","outputs":[{"name":"_tokenHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastPurchasedBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxBlockPurchaseInOneGo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pricePerBlockInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"purchase","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"blocknumbersOf","outputs":[{"name":"_blocks","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_pricePerBlockInWei","type":"uint256"},{"name":"_maxBlockPurchaseInOneGo","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_funder","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"},{"indexed":false,"name":"_blockhash","type":"bytes32"},{"indexed":false,"name":"_block","type":"uint256"}],"name":"Purchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_funder","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"},{"indexed":false,"name":"_blocksPurchased","type":"uint256"}],"name":"Purchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]';

const app = express();

app.get('/:contractAddress', function (req, res) {

    const address = req.params.contractAddress;
    const contract = new ethers.Contract(address, abi, provider);

    return contract.nextHash()
        .then((result) => {
            let hashOnly = result[0];
            res.send(hashOnly);
        })
        .catch(err => console.log(err));
});

app.get('/:contractAddress/json', function (req, res) {

    const address = req.params.contractAddress;
    const contract = new ethers.Contract(address, abi, provider);

    return contract.nextHash()
        .then((result) => {
            let hashOnly = result[0];
            res.json(hashOnly);
        })
        .catch(err => console.log(err));
});

app.get('/:contractAddress/blocknumber', function (req, res) {

    const address = req.params.contractAddress;
    const contract = new ethers.Contract(address, abi, provider);

    return contract.nextHash()
        .then((result) => {
            res.json({hash: result[0], blocknumber: result[1].toString(10)});
        })
        .catch(err => console.log(err));
});

app.get('/:contractAddress/details', function (req, res) {

    const address = req.params.contractAddress;
    const contract = new ethers.Contract(address, abi, provider);

    return Promise.all([
        contract.pricePerBlockInWei(),
        contract.maxBlockPurchaseInOneGo(),
        contract.blocknumber(),
        contract.lastPurchasedBlock(),
        contract.nextPurchasableBlocknumber(),
        contract.token(),
        contract.owner()
    ])
        .then((result) => {
            res.json({
                pricePerBlockInWei: result[0].toString(10),
                maxBlockPurchaseInOneGo: result[1].toString(10),
                blocknumber: result[2].toString(10),
                lastPurchasedBlock: result[3].toString(10),
                nextPurchasableBlocknumber: result[4].toString(10),
                token: result[5],
                owner: result[6]
            });
        })
        .catch(err => console.log(err));
});

app.get('/', function (req, res) {
    return res.json(`use /{contractAddress}`);
});

app.listen(27264, () => console.log('art-blocks-next-hash-endpoint => listening on http://localhost:27264/'));
