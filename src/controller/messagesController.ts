import { Request, Response } from 'express';
import Db from "../model/db";

const db = new Db();

export async function insertMessage(req: Request, res: Response){
    const { sensorName, message } = req.body;
    
    const result = await db.messages.insertNewMessage(sensorName, message);
    
    if(result.isSuccess){
        return res.status(200).json({ isSuccess: result.isSuccess, message: result.message })
    }

    res.status(500).json({ isSuccess: false, message: 'Internal server error' });
}

export async function getMessages(req: Request, res: Response){
    const result = await db.messages.getLast100Messages();

    if(result.isSuccess){
        return res.status(200).json({ isSuccess: result.isSuccess, data: result.data, message: result.message })
    }

    res.status(500).json({ isSuccess: false, message: 'Internal server error' });
}