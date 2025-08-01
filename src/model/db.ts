import handleSqlQuery from '../helper/handleSqlQuery';
import logger from "../helper/logger";

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

export default class Db {
    public accounts: Accounts;
    public airData: AirData;
    public messages: Messages;

    constructor() {
        this.accounts = new Accounts();
        this.airData = new AirData();
        this.messages = new Messages();
    }
}

class Accounts{
    /**
     * getUserDataFromUsername
     */
    public async getUserDataFromUsername(username: string) {
        const sqlQuery: string = `SELECT * FROM Account WHERE Username LIKE ?`;
        const valuesToEscape: any[] = [username];

        try {
            const queryResult = await handleSqlQuery(sqlQuery, valuesToEscape);

            if (queryResult.length === 0) { // If zero it means there is no user with the username passed in the body
                return { isSuccess: false, message: 'Wrong Username or Password' };
            }

            const user = queryResult[0];
            return { isSuccess: true, user: user, message: 'User data found!' };

        } catch (error) {
            logger.error('getUserDataFromUsername: ', error);
            return { isSuccess: false, message: 'Internal server error' };
        }
    }
}

class AirData{
    /**
     * getLastDataEntry
     */
    public async getLastDataEntry() {
        try {
            // const sqlQuery: string = 'SELECT * FROM AirQualityData ORDER BY entryId DESC LIMIT 1;';
            const sqlQuery: string = 'SELECT temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry FROM AirQualityData WHERE entryId = ( SELECT MAX(entryId) FROM AirQualityData );';
            const queryResult: any[] = await handleSqlQuery(sqlQuery);

            if (queryResult.length === 0) { // If zero it means there is no user with the username passed in the body
                return { isSuccess: false, message: 'There is no data!' };
            }

            const airData: object = queryResult[0];
            return { isSuccess: true, airData: airData, message: 'Found data' };
        } catch (error) {
            logger.error('getLastDataEntry: ', error);
            return { isSuccess: false, message: 'Internal server error' };
        }
    }

    /**
     * insertAirData
     */
    public async insertAirData(reqData: ReqAirData) {
        const {temperature, humidity, pm1, pm2_5, pm10, co2, voc} = reqData;
        try {
            // const sqlQuery: string = 'SELECT * FROM AirQualityData ORDER BY entryId DESC LIMIT 1;';
            const sqlQuery: string = 'INSERT INTO AirQualityData VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, DEFAULT);'; // DEFAULT because the id is auto-increment and the timestamp is auto-generated
            const valuesToEscape: number[] = [temperature, humidity, pm1, pm2_5, pm10, co2, voc];
            await handleSqlQuery(sqlQuery, valuesToEscape);
            // logger.debug('Successfully inserted data: ', queryResult);
            return { isSuccess: true, message: 'Insert successful' };
        } catch (error) {
            logger.error('DB error: ', error);
            return { isSuccess: false, message: 'Internal server error' };
        }
    }
}

class Messages{
    /**
     * insertMessage
     */
    public async insertNewMessage(sensorName: string, message: string) {
        const sqlQuery: string = 'INSERT INTO Messages (SensorName, Message) VALUES (?, ?)';
        const valuesToEscape: any[] = [sensorName, message];

        try {
            await handleSqlQuery(sqlQuery, valuesToEscape);

            return { isSuccess: true, message: 'Message inserted successfully' };
        } catch (error: any) {
            logger.error('insertNewMessage: ', error);
            return { isSuccess: false, message: 'Internal server error' };
        }
    }
    
    /**
     * getLast100Messages
     */
    public async getLast100Messages() {
        const sqlQuery: string = 'SELECT * FROM Messages ORDER BY CreatedAt DESC LIMIT 100;';
        try {
            const queryResult = await handleSqlQuery(sqlQuery);
            const messages = queryResult[0];

            return{ isSuccess: true, data: messages, message: 'Messages retrieved successfully' };
        } catch (error: any) {
            logger.error('getLast100Messages: ', error);
            return{ isSuccess: false, message: 'Internal server error' };
        }
    }
}