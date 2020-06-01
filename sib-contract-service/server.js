require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let contracts = []

app.get('/api/contracts', authenticateToken, (req, res) => {
    //console.log("--->Get All contracts: \n" + JSON.stringify(contracts, null, 4));
    res.send(contracts);
});

app.post('/api/contracts', authenticateToken, (req, res) => {
    console.log("post new contract");
    console.log("new contract body" + JSON.stringify(req.body));
    const newContract = req.body
    newContract.id = uuidv4();

    console.log(JSON.stringify(newContract.product));
    console.log(JSON.stringify(newContract.product.subContracts));

    newContract.customer_name = newContract.customer.firstName + " " + newContract.customer.lastName;
    newContract.subContracts = []
    newContract.subContracts.push(bookContract(newContract.product.subContracts.allianz));
    newContract.subContracts.push(bookContract(newContract.product.subContracts.huk));
    newContract.subContracts.push(bookContract(newContract.product.subContracts.hdi));

    newContract.rateBreakDown = "";
    newContract.rate = 0;
    newContract.subContracts.forEach( subContract => {
        newContract.rate = newContract.rate + subContract.rate;
        newContract.rateBreakDown = newContract.rateBreakDown +"|"+ subContract.product.product_name+":"+subContract.rate
    })
    //newContract.rate = newContract.subContracts.allianz.contract.rate + newContract.subContracts.huk.contract.rate + newContract.subContracts.hdi.contract.rate;
    contracts.push(newContract)

    console.log(JSON.stringify(newContract));

    res.send(contracts);
});

app.delete('/api/contracts', authenticateToken, (req, res) => {
    let contractToDelete = contracts.find(contract => contract.id === req.query.id)
    if (contractToDelete !== null) {
        contracts = contracts.filter(contract => contract.id !== req.query.id)
        res.send(contracts);
    } else {
        res.status(404);
        res.send('object not found');
    }
});

function authenticateToken(req, res, next) {
    console.log("authenticateToken");
    const authHeader = req.headers['authorization']
    console.log("authHeader:" + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

bookContract = function (product) {
    return {
        id: uuidv4(),
        "product": product,
        rate: 100 * (Math.floor(Math.random() * 6) + 1)
    }
}

app.listen(3002)
