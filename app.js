"use strict";
// 
// Automaticcally added imports type
// 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 
//modules required for this porject
//
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express = require('express');
const path = require('path');
const handleSqlQuery = require(path.join(__dirname, 'handleSqlQuery.js'));
// 
// Initializing server
// 
const app = express();
app.listen(process.env.PORT, console.log(`Server listening on http://localhost:${process.env.PORT} ...`));
// 
// Decode json from post API resquest
// 
app.use(express.json()); //this middleware make possible to express to work with json files
app.use(express.urlencoded({ extended: true })); //this middleware automatically decode the json file sended with the post method
// 
// Paths
// 
const webPagesPath = path.join(__dirname, 'public', 'webpages');
// 
// Middlewares
// 
// 
// Static web pages endpoints
//
app.use(`/`, express.static(webPagesPath));
app.get('/', (req, res) => {
    res.status(200).sendFile('home.html', { root: path.join(webPagesPath, 'home') });
});
// 
// API REST
// 
// get all data of last entry
app.get('/api/v0/last-entry-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const sqlQuery: string = 'SELECT * FROM airqualitydata ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery = 'SELECT temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry FROM airqualitydata WHERE entryId = ( SELECT MAX(entryId) FROM airqualitydata );';
        const queryResult = yield handleSqlQuery(sqlQuery);
        const airData = queryResult[0];
        res.status(200).json({ isSuccess: true, data: airData });
    }
    catch (error) {
        res.status(400).json({ isSuccess: false, message: error });
    }
}));
// insert air data in db
app.post('/api/v0/insert-air-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { temperature, humidity, pm1, pm2_5, pm10, co2, voc, apiPassword } = req.body;
    // check if data comes from a secure source
    if (apiPassword !== process.env.API_PASSWORD)
        return res.status(400).json({ isSuccess: false, message: 'Wrong password' });
    try {
        // const sqlQuery: string = 'SELECT * FROM airqualitydata ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery = 'INSERT INTO airqualitydata VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, DEFAULT);'; // DEFAULT because the id is auto-increment and the timestamp is auto-generated
        const valuesToEscape = [temperature, humidity, pm1, pm2_5, pm10, co2, voc];
        const queryResult = yield handleSqlQuery(sqlQuery, valuesToEscape);
        res.status(200).json({ isSuccess: true, message: 'Insert successful' });
    }
    catch (error) {
        res.status(400).json({ isSuccess: false, message: error });
    }
}));
