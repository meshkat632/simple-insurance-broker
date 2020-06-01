require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let customers = [
    {
        id: uuidv4(),
        lastName: "Brandan ",
        firstName: "Colon",
        email: "bc@w"
    },
    {
        id: uuidv4(),
        lastName: "Robson ",
        firstName: "Gamble",
        email: "rg@w"
    },
    {
        id: uuidv4(),
        lastName: "Ashlyn ",
        firstName: "Johnson",
        email: "aj@w"
    },
    {
        id: uuidv4(),
        lastName: "Shamima",
        firstName: "Brown",
        email: "sb@w"
    }
]

app.get('/api/customers', authenticateToken, (req, res) => {
    console.log(" get customers"+customers);
    res.send(customers);
});

app.post('/api/customers', authenticateToken, (req, res) => {
    if(customers.find(user => user.email === req.body.email) === undefined){
        const newCustomer = req.body
        newCustomer.id = uuidv4();
        customers.push(newCustomer)
        res.send(customers);
    }else {
        console.log("customer with email already exits");
        res.status(400);
        res.send("customer with email already exits");
    }
});

app.delete('/api/customers', authenticateToken, (req, res) => {
    let customerToDelete = customers.find(customer => customer.id === req.query.id)
    if (customerToDelete !== null) {
        customers = customers.filter(customer => customer.id !== req.query.id)
        res.send(customers);
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

app.listen(3003)
