// 
// Imports
// 

import { Store } from 'express-session';
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
import dotenv from 'dotenv';
dotenv.config();

const sessionStore: Store = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
});

export default session({
    key: 'air-quality-site',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        httpOnly: true,
        sameSite: true,
        // secure: true,
    }
});