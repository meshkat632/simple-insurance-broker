if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

global.__basedir = __dirname;
var path = __basedir + '/views/';

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []
app.set('view-engine', 'ejs')
app.use(express.static('resources'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('contracts.ejs', {name: req.user.name})

})
app.delete('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})


app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', (req, res) => {
    res.render('register.ejs')
})
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch (e) {
        console.error(e)
        res.redirect('/register')
    }
    console.log(users)
})
app.get('/api/customers/all', checkAuthenticated, (req, res) =>{
    console.log("--->Get All Customers: \n" + JSON.stringify(customers, null, 4));
    res.send(customers);
});
app.use("*", (req,res) => {
    res.sendFile(path + "404.html");
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// Fetch all Customers
var customers = [
    {
        id: 1,
        name: "Jack",
        age: 25,
        address:{
            street: "NANTERRE CT",
            postcode: "77471"
        }
    },
    {
        id: 2,
        name: "Mary",
        age: 37,
        address:{
            street: "W NORMA ST",
            postcode: "77009"
        }
    },
    {
        id: 3,
        name: "Peter",
        age: 17,
        address:{
            street: "S NUGENT AVE",
            postcode: "77571"
        }
    },
    {
        id: 4,
        name: "Amos",
        age: 23,
        address:{
            street: "E NAVAHO TRL",
            postcode: "77449"
        }
    },
    {
        id: 5,
        name: "Craig",
        age: 45,
        address: {
            street: "AVE N",
            postcode: "77587"
        }
    }
]


app.listen(3001)
