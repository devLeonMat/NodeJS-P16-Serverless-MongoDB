'use strict';

const serverless = require('serverless-http');
const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.urlencoded({extended: true}));



app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/accounts', (req, res)=>{
    const {accountId, name} = req.body;
    res.json({accountId, name})
});


module.exports.generic = serverless(app);
