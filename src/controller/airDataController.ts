import { Request, Response } from 'express';
import handleSqlQuery from '../helper/handleSqlQuery';
import logger from "../helper/logger";
import Db from "../model/db";

const db = new Db();

export async function lastDataEntry(req: Request, res: Response) {
    const result = await db.airData.getLastDataEntry();
    if(!result.isSuccess){
        return res.status(500).json({ isSuccess: result.isSuccess, message: result.message });
    }

    res.status(200).json({ isSuccess: result.isSuccess, data: result.airData, message: result.message });
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

    const { apiPassword } = req.body;

    // check if data comes from a secure source
    if (apiPassword !== process.env.API_PASSWORD) {
        logger.error('Suspicious attempt to insert data with wrong password');
        return res.status(401).json({ isSuccess: false, message: 'Wrong password' });
    }

    const result = await db.airData.insertAirData(req.body);

    if(!result.isSuccess){
        return res.status(500).json({ isSuccess: result.isSuccess, message: result.message });
    }

    res.status(200).json({ isSuccess: result.isSuccess, message: result.message });
}