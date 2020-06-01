require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

var contracts = [
    {
        id: 1000001,
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
        id: 1000002,
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
    console.log("--->Get All contracts: \n" + JSON.stringify(contracts, null, 4));
    res.send(contracts);
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
