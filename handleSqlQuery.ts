import { PoolConnection } from "mysql";

const mysql = require('mysql');

const homelabURI: string = '192.168.1.32'
const homelabURIport: string = '3306';

const conPool: PoolConnection = mysql.createPool({
    connectionLimit: 10,
    host: homelabURI,
    port: homelabURIport,
    user: "nodeUser",
    password: "NonPensoSiaDavveroNecessarioAvereUnaPasswordCosiDifficile",
    database: 'air-quality-monitor-data'
});

const handleSqlQuery = (sqlQuery: string, valuesToEscape: any[] = [null]) => {
    return new Promise((resolve, reject) => {
        if(valuesToEscape[0] === null){
            conPool.query(sqlQuery, (error: any, results: any[], fields: any) => { // fields is "any" because I don't use it, so I don't care what it is
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        }else{
            conPool.query(sqlQuery, valuesToEscape, (error: any, results: any[], fields: any) => { // fields is "any" because I don't use it, so I don't care what it is
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        }
    });
};

module.exports = handleSqlQuery;
