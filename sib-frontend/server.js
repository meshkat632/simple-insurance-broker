if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

console.log("NODE_ENV:"+process.env.NODE_ENV);
console.log("SESSION_SECRET:"+process.env.SESSION_SECRET);
console.log("ACCESS_TOKEN_SECRET:"+process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:"+process.env.REFRESH_TOKEN_SECRET);
console.log("API_CONTRACTS_HOST:"+process.env.API_CONTRACTS_HOST);
console.log("API_CONTRACTS_PORT:"+process.env.API_CONTRACTS_PORT);
console.log("API_CUSTOMER_HOST:"+process.env.API_CUSTOMER_HOST);
console.log("API_CUSTOMER_PORT:"+process.env.API_CUSTOMER_PORT);
console.log("API_PRODUCT_HOST:"+process.env.API_PRODUCT_HOST);
console.log("API_PRODUCT_PORT:"+process.env.API_PRODUCT_PORT);



const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')
const jwt = require('jsonwebtoken')

global.__basedir = __dirname;
var path = __basedir + '/views/';

const configureApiProxy = require('./api-proxy-config')
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = [ { id: '1590969423924',
    name: 'w',
    email: 'w@w',
    password: '$2b$10$CLodCNYDN3XAsYMph9Hl..uDcONVr//lmCF9p4XqEkeY7TYMaDOsm' }
]
let refreshTokens = []
app.set('view-engine', 'ejs')
app.use(express.static('resources'));
app.use(express.json())
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
    res.render('index.ejs', {name: req.user.name})

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

app.delete('/token', checkAuthenticated, (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.get('/token', checkAuthenticated, (req, res) => {
    const user = { name: req.user.username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

configureApiProxy(app)

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

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2000m' })
}
app.listen(3001)
