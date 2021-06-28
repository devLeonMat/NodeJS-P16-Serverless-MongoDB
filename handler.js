'use strict';

const serverless = require('serverless-http');
const express = require('express');

const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const ACCOUNT_TABLE = process.env.ACCOUNT_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDB;

if (IS_OFFLINE) {
    dynamoDB = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:3000'
    });
} else {
    dynamoDB = new AWS.DynamoDB.DocumentClient();
}


app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/accounts', (req, res) => {
    const {accountId, name} = req.body;

    const params = {
        TableName: ACCOUNT_TABLE,
        Item: {
            accountId, name
        }
    };
    dynamoDB.put(params, (err) => {
        if (err) {
            console.error(err);
            res.status(400).json({
                error: 'Error creando cuenta'
            })
        } else {
            res.json({accountId, name})
        }
    });
});

app.get('/accounts', (req, res) => {
    const params = {
        TableName: ACCOUNT_TABLE,
    };
    dynamoDB.scan(params, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({
                error: 'Error obteniendo cuentas'
            })
        } else {
            const {Items} = result;
            res.json({
                success: true,
                message: 'Cuentas obtenidas',
                accounts: Items
            })
        }
    });

});

app.get('/accounts/:accountId', (req, res) => {
    const params = {
        TableName: ACCOUNT_TABLE,
        Key: {
            accountId: req.params.accountId
        }
    };
    dynamoDB.get(params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: 'we cant access to account'
            })
        }
        if (result.Item) {
            const {accountId, name} = result.Item
            return res.json({
                accountId, name
            });
        } else {
            res.status(400).json({
                error: 'Account not found!'
            })
        }
    });
})


module.exports.generic = serverless(app);
