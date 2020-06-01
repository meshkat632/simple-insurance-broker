require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let contracts = [
    {
        id: uuidv4(),
        customer_name: "Bob",
        customer_id: 50001,
        rate: 200,
        subContracts: [
            {
                contactId: 10002,
                provider: 'Allianz',
                rate: 100
            },
            {
                contactId: 20001,
                provider: 'HDI',
                rate: 100
            }
        ]

    },
    {
        id: uuidv4(),
        customer_name: "Alice",
        customer_id: 50002,
        rate: 200,
        subContracts: [
            {
                contactId: 10002,
                provider: 'Allianz',
                rate: 100
            },
            {
                contactId: 20001,
                provider: 'HDI',
                rate: 100
            }
        ]

    }
]

app.get('/api/contracts', authenticateToken, (req, res) => {
    //console.log("--->Get All contracts: \n" + JSON.stringify(contracts, null, 4));
    res.send(contracts);
});

app.post('/api/contracts', authenticateToken, (req, res) => {
    console.log("post new contract");
    console.log("new contract body" + JSON.stringify(req.body));
    const newContract = req.body
    newContract.id = uuidv4();
    contracts.push(newContract)
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

app.listen(3002)
