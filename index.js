require('dotenv').config()
const express = require('express');
const session = require('express-session');
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const students = require('./students.json')


const app = express();
app.use(session({
    secret: 'asdf',
    resave: false,
    saveUninitialized: true
}))

let {
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET
} = process.env

app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: '/login',
    scope: "openid email profile"
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile)
    }
))

passport.serializeUser((user, done) => {
    done(null, { clientID: user.id, email: user._json.email, name: user._json.name })
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

app.get('/login', passport.authenticate('auth0', { successRedirect: '/students', failureRedirect: '/login', connection: 'github'}))
authenticated = (req,res,next)=>{
    if(req.user){
        next()
    } else {
        res.status(401).send('OOPS NOT FOUND')
    }
}
app.get('/students', authenticated, (req,res) => {res.status(200).send(students)})

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });