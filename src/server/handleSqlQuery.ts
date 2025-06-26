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
