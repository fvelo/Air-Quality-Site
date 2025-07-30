import { Request, Response } from 'express';
import handleSqlQuery from '../helper/handleSqlQuery';
import logger from "../helper/logger";

export async function lastDataEntry(req: Request, res: Response) {
    try {
        // const sqlQuery: string = 'SELECT * FROM AirQualityData ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery: string = 'SELECT temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry FROM AirQualityData WHERE entryId = ( SELECT MAX(entryId) FROM AirQualityData );';
        const queryResult: any[] = await handleSqlQuery(sqlQuery);
        const airData: object = queryResult[0];
        // logger.debug('Successfully sent air data to client');
        res.status(200).json({ isSuccess: true, data: airData });
    } catch (error) {
        logger.error('DB error: ', error);
        res.status(500).json({ isSuccess: false, message: 'Internal error' });
    }
}

export async function insertAirData(req: Request, res: Response) {
    type ReqAirData = {
        temperature: number,
        humidity: number,
        pm1: number,
        pm2_5: number,
        pm10: number,
        co2: number,
        voc: number,
        apiPassword: string
    }

    function isValidAirData(body: any) {
        return (
            !isNaN(body.temperature) && // if it's not 'not a number', it is a number
            !isNaN(body.humidity) &&
            !isNaN(body.pm1) &&
            !isNaN(body.pm2_5) &&
            !isNaN(body.pm10) &&
            !isNaN(body.co2) &&
            !isNaN(body.voc) &&
            typeof body.apiPassword === 'string'
        );
    }

    if (!isValidAirData(req.body)) {
        logger.error('Attempt to insert body with wrong types');
        return res.status(400).json({ isSuccess: false, message: 'Invalid body type' });
    }

    const { temperature, humidity, pm1, pm2_5, pm10, co2, voc, apiPassword } = req.body as ReqAirData;

    // check if data comes from a secure source
    if (apiPassword !== process.env.API_PASSWORD) {
        logger.error('Suspicious attempt to insert data with wrong password');
        return res.status(400).json({ isSuccess: false, message: 'Wrong password' });
    }

    try {
        // const sqlQuery: string = 'SELECT * FROM AirQualityData ORDER BY entryId DESC LIMIT 1;';
        const sqlQuery: string = 'INSERT INTO AirQualityData VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, DEFAULT);'; // DEFAULT because the id is auto-increment and the timestamp is auto-generated
        const valuesToEscape: number[] = [temperature, humidity, pm1, pm2_5, pm10, co2, voc]
        const queryResult: any[] = await handleSqlQuery(sqlQuery, valuesToEscape);
        // logger.debug('Successfully inserted data: ', queryResult);
        res.status(200).json({ isSuccess: true, message: 'Insert successful' });
    } catch (error) {
        logger.error('DB error: ', error);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
    }
}