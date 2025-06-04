"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
const homelabURI = '192.168.1.32';
const homelabURIport = '3306';
const conPool = mysql.createPool({
    connectionLimit: 10,
    host: homelabURI,
    port: homelabURIport,
    user: "nodeUser",
    password: "NonPensoSiaDavveroNecessarioAvereUnaPasswordCosiDifficile",
    database: 'air-quality-monitor-data'
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
