const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config();


//IMPORT ROUTES
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');



//CONNECT THE API TO THE MongoDB cluster
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    })


//MIDDLEWARE
    //allow all requests from all origins to access the API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
    //parsing the incoming request bodies (replace body-parser)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
    //serving static resource images
app.use('/images', express.static(path.join(__dirname, 'images')));
    //using routes, setting the endpoint
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;