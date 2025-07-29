// 
// Automatically added imports type
// 

import { NextFunction, Request, Response } from "express";

// 
// modules required for this porject
// 

import dotenv from 'dotenv';
import logger from "../helper/logger";
dotenv.config();
const express = require('express');
const path = require('path');
const handleSqlQuery = require(path.join(__dirname, 'handleSqlQuery.js'));
import { rateLimit } from 'express-rate-limit'

// 
// Initializing server
// 

const app = express();
const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server listening on http://localhost:${PORT}...`));
logger.info(`Server listening on http://localhost:${PORT}...`);

// 
// Decode json from post API resquest
// 

app.use(express.json()); //this middleware make possible to express to work with json files
app.use(express.urlencoded({ extended: true })); //this middleware automatically decode the json file sended with the post method

// 
// Paths
// 

const html_css_files: string = path.join('public', 'webpages');
const js_files: string = path.join(__dirname, '../', 'frontend');

// 
// Middlewares
// 

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: 'Request limit reached',
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// 
// Static web pages endpoints
//

// console.log('running from:', __dirname);
app.use(`/`, express.static(html_css_files));
app.use('/frontend', express.static(js_files));


app.get('/', (req: Request, res: Response) => {
    res.status(200).sendFile('home.html', { root: path.join(html_css_files, 'home') });
});

app.get('/login', (req: Request, res: Response) => {
    res.status(200).sendFile('login.html', { root: path.join(html_css_files, 'login') });
});

// 
// API REST
// 

// get all data of last entry
app.get('/api/v0/last-entry-data', async (req: Request, res: Response) => {
    try {
        // const sqlQuery: string = 'SELECT * FROM AirQualityData ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery: string = 'SELECT temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry FROM AirQualityData WHERE entryId = ( SELECT MAX(entryId) FROM AirQualityData );';
        const queryResult: any[] = await handleSqlQuery(sqlQuery);
        const airData: object = queryResult[0];
        // logger.debug('Successfully sent air data to client');
        res.status(200).json({ isSuccess: true, data: airData });
    } catch (error) {
        logger.error('DB error: ', error);
        res.status(500).json({ isSuccess: false, message: 'Internal error' });
    }
});

// insert air data in db
app.post('/api/v0/insert-air-data', async (req: Request, res: Response) => {
    type ReqAirData = {
        temperature: number,
        humidity: number,
        pm1: number,
        pm2_5: number,
        pm10: number,
        co2: number,
        voc: number,
        apiPassword: string
    }

    function isValidAirData(body: any){
        return (
            !isNaN(body.temperature) && // if it's not 'not a number', it is a number
            !isNaN(body.humidity) &&
            !isNaN(body.pm1) &&
            !isNaN(body.pm2_5) &&
            !isNaN(body.pm10) &&
            !isNaN(body.co2) &&
            !isNaN(body.voc) &&
            typeof body.apiPassword === 'string'
        );
    }

    if(!isValidAirData(req.body)){
        logger.error('Attempt to insert body with wrong types');
        return res.status(400).json({isSuccess: false, message: 'Invalid body type'});
    }

    const { temperature, humidity, pm1, pm2_5, pm10, co2, voc, apiPassword } = req.body as ReqAirData;
    
    // check if data comes from a secure source
    if (apiPassword !== process.env.API_PASSWORD){
        logger.error('Suspicious attempt to insert data with wrong password');
        return res.status(400).json({ isSuccess: false, message: 'Wrong password' });
    }

    try {
        // const sqlQuery: string = 'SELECT * FROM AirQualityData ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery: string = 'INSERT INTO AirQualityData VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, DEFAULT);'; // DEFAULT because the id is auto-increment and the timestamp is auto-generated
        const valuesToEscape: number[] = [temperature, humidity, pm1, pm2_5, pm10, co2, voc]
        const queryResult: any[] = await handleSqlQuery(sqlQuery, valuesToEscape);
        // logger.debug('Successfully inserted data: ', queryResult);
        res.status(200).json({ isSuccess: true, message: 'Insert successful' });
    } catch (error) {
        logger.error('DB error: ', error);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
    }
});

app.post('/api/v0/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const sqlQuery = 'SELECT Username, HashPassword FROM Account';

    try {
        // logger.info(`Username: ${username}, Password: ${password}`);
        // console.log(`Username: ${username}, Password: ${password}`);

        const queryResult = await handleSqlQuery(sqlQuery);
        // console.log(`queryresult:`, queryResult);

        const { Username, HashPassword } = queryResult[0];
        if(username !== Username && password !== HashPassword){
            return res.status(403).json({ isSuccess: false, message: 'Wrong Email or Password' });
        }

        return res.status(200).json({ isSuccess: true, message: 'User identified' });
    } catch (error) {
        logger.error('DB error: ', error);
        return res.status(500).json({ isSuccess: false, message: 'Internal server error' });
    }
});