// 
// Automatically added imports type
// 

import { NextFunction, Request, Response } from "express";

// 
// modules required for this project
// 

import dotenv from 'dotenv';
dotenv.config();
const express = require('express');
import logger from "../helper/logger";
import session from "../helper/session";
import handleSqlQuery from "../helper/handleSqlQuery";
import { loginHandler, logoutHandler } from "../controller/authController";
import { lastDataEntry, insertAirData } from "../controller/airDataController";
import { sessionData } from "../controller/sessionDataController";
import { requireAuth } from "../middleware/auth";
const path = require('path');
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
});

app.use(limiter); // Apply the rate limiting middleware to all requests
app.use(session);
app.use('/account', requireAuth);

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

app.get('/account', (req: Request, res: Response) => {
    res.status(200).sendFile('login.html', { root: path.join(html_css_files, 'login') });
});

// 
// API REST
// 

app.get('/api/v0/last-entry-data', lastDataEntry);

app.post('/api/v0/insert-air-data', insertAirData);

app.post('/api/v0/auth/login', loginHandler);

app.post('/api/v0/auth/logout', logoutHandler);

app.get('/api/v0/session-data', sessionData);