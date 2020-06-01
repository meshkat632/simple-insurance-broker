require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let contracts = []

let products = [{
    id: uuidv4(),
    product_name: "Product-1",
    subContracts: {
        "allianz": {
            id: uuidv4(),
            product_name: "Allianz-Product-1",
        },
        "hdi": {
            id: uuidv4(),
            product_name: "HDI-Product-1",
        },
        "huk": {
            id: uuidv4(),
            product_name: "HUK-Product-1",
        }
    }
},
    {
        id: uuidv4(),
        product_name: "Product-2",
        subContracts: {
            "allianz": {
                id: uuidv4(),
                product_name: "Allianz-Product-2",
            },
            "hdi": {
                id: uuidv4(),
                product_name: "HDI-Product-2",
            },
            "huk": {
                id: uuidv4(),
                product_name: "HUK-Product-2",
            }
        }
    },
    {
        id: uuidv4(),
        product_name: "Product-3",
        subContracts: {
            "allianz": {
                id: uuidv4(),
                product_name: "Allianz-Product-3",
            },
            "hdi": {
                id: uuidv4(),
                product_name: "HDI-Product-3",
            },
            "huk": {
                id: uuidv4(),
                product_name: "HUK-Product-3",
            }
        }
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

    x = {
        "customerId": "57fe20d8-054f-4702-865d-a3de511b2b9a",
        "product": {
            "id": "fedb451d-8772-428e-bd11-6b174401ccb1",
            "product_name": "Product-2",
            "subContracts": {
                "allianz": {
                    "id": "a916cb6a-8734-48cf-a19d-67aae60247da",
                    "product_name": "Allianz-Product-2",
                    "rate": 200
                },
                "hdi": {"id": "b517070e-e4eb-4fd7-80e4-ca1f42b52c5d", "product_name": "HDI-Product-2", "rate": 50},
                "huk": {"id": "3b3f3766-23b7-4a5e-80ce-1ba183611ed6", "product_name": "HUK-Product-2", "rate": 30}
            }
        },
        "customer": {
            "firstName": "sfsdf",
            "lastName": "asdfsad",
            "email": "fd@sdfsdfdfff",
            "id": "57fe20d8-054f-4702-865d-a3de511b2b9a"
        }
    }

    console.log(JSON.stringify(newContract.product));
    console.log(JSON.stringify(newContract.product.subContracts));

    newContract.customer_name = newContract.customer.firstName + " " + newContract.customer.lastName;
    newContract.subContracts = []
    newContract.subContracts.push(bookContract(newContract.product.subContracts.allianz));
    newContract.subContracts.push(bookContract(newContract.product.subContracts.huk));
    newContract.subContracts.push(bookContract(newContract.product.subContracts.hdi));

    newContract.rate = 0;
    newContract.subContracts.forEach( subContract => {
        newContract.rate = newContract.rate + subContract.rate;
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

app.get('/api/products', authenticateToken, (req, res) => {
    res.send(products);
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
