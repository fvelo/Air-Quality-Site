"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mysql = require('mysql');
const conPool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME
});
const handleSqlQuery = (sqlQuery, valuesToEscape = [null]) => {
    return new Promise((resolve, reject) => {
        if (valuesToEscape[0] === null) {
            conPool.query(sqlQuery, (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        }
        else {
            conPool.query(sqlQuery, valuesToEscape, (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        }
    });
};
module.exports = handleSqlQuery;
