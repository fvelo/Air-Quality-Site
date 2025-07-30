import { PoolConnection } from "mysql";
import dotenv from 'dotenv';
dotenv.config();

const mysql = require('mysql');

const conPool: PoolConnection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_USER_PASSWORD as string,
    database: process.env.DB_NAME as string
});

export default conPool;