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
Object.defineProperty(exports, "__esModule", { value: true });
// 
//modules required for this porject
// 
const express = require('express');
const path = require('path');
const handleSqlQuery = require(path.join(__dirname, 'handleSqlQuery.js'));
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
        const sqlQuery = 'SELECT * FROM airqualitydata WHERE entryId = ( SELECT MAX(entryId) FROM airqualitydata );';
        const queryResult = yield handleSqlQuery(sqlQuery);
        res.status(200).json({ isSuccess: true, data: queryResult });
    }
    catch (error) {
        res.status(400).json({ isSuccess: false, message: 'Error in request' });
    }
}));
