const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


// Dependency injections
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


// updated knex db to heroku db
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
        host: '127.0.0.1',
    }
});

db.select('*').from('users').then(response => {
    response
});

const app = express();

// Enviromental variables
const PORT = process.env.PORT || 3000;

// Using body-parser
app.use(bodyParser.json());

// Use cors package
app.use(cors());


// Default home route
app.get('/', (req, res) => {
    res.send('It is working')
})

// Sign in route
// Doesn't need to be a trx cos we are just checking
// not modifying any of the database items
// adv function syntax
app.post('/signin', signin.handleSignIn(db, bcrypt))

// Register route
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })



// Profile route
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })


// Image route
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// Clarifai Api
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is working on port ${PORT}`)
})

/*
ENDPOINTS
Routes Response
/ --> This is working
/signin --> POST = success/fail Done
/register --> POST = new user
/profile/:userId --> GET = user
/image --> PUT--> user
*/