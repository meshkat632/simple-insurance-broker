require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

app.use(express.json())
app.use(express.urlencoded({extended: false}))

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

app.listen(3004)
