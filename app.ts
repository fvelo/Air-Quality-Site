// 
// Automaticcally added imports type
// 

import { NextFunction, Request, Response } from "express";

// 
//modules required for this porject
// 

const express = require('express');
const path = require('path');
const handleSqlQuery = require(path.join(__dirname, 'handleSqlQuery.js'));
const { API_PASSWORD } = require(path.join(__dirname, 'sensibleData.js'));

// 
// Initializing server
// 

const app = express();
app.listen(3000, console.log('Server listening on http://localhost:3000 ...'));

// 
// Decode json from post API resquest
// 

app.use(express.json()); //this middleware make possible to express to work with json files
app.use(express.urlencoded({ extended: true })); //this middleware automatically decode the json file sended with the post method

// 
// Paths
// 

const webPagesPath: string = path.join(__dirname, 'public', 'webpages');

// 
// Middlewares
// 



// 
// Static web pages endpoints
//

app.use(`/`, express.static(webPagesPath));

app.get('/', (req: Request, res: Response) => {
    res.status(200).sendFile('home.html', { root: path.join(webPagesPath, 'home') });
});

// 
// API REST
// 

// get all data of last entry
app.get('/api/v0/last-entry-data', async (req: Request, res: Response) => {
    try {
        // const sqlQuery: string = 'SELECT * FROM airqualitydata ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery: string = 'SELECT temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry FROM airqualitydata WHERE entryId = ( SELECT MAX(entryId) FROM airqualitydata );';
        const queryResult: any[] = await handleSqlQuery(sqlQuery);
        const airData: object = queryResult[0];
        res.status(200).json({ isSuccess: true, data: airData });
    } catch (error) {
        res.status(400).json({ isSuccess: false, message: error });
    }
});

// insert air data in db
app.post('/api/v0/insert-air-data', async (req: Request, res: Response) => {
    type reqAirData = {
        temperature: number,
        humidity: number,
        pm1: number,
        pm2_5: number,
        pm10: number,
        co2: number,
        voc: number,
        apiPassword: string
    }

    const { temperature, humidity, pm1, pm2_5, pm10, co2, voc, apiPassword } = req.body as reqAirData;

    // check if data comes from a secure source
    if (apiPassword !== API_PASSWORD) return res.status(400).json({ isSuccess: false, message: 'Wrong password' });

    try {
        // const sqlQuery: string = 'SELECT * FROM airqualitydata ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery: string = 'INSERT INTO airqualitydata VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, DEFAULT);'; // DEFAULT because the id is auto-increment and the timestamp is auto-generated
        const valuesToEscape: number[] = [temperature, humidity, pm1, pm2_5, pm10, co2, voc]
        const queryResult: any[] = await handleSqlQuery(sqlQuery, valuesToEscape);
        res.status(200).json({ isSuccess: true, message: 'Insert successful' });
    } catch (error) {
        res.status(400).json({ isSuccess: false, message: error });
    }
});