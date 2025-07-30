import { Request, Response } from 'express';
import handleSqlQuery from '../helper/handleSqlQuery';
import { verifyPassword} from '../helper/crypt';
import logger from "../helper/logger";

export async function loginHandler(req: Request, res: Response) {
    const { username, password } = req.body;
    const sqlQuery: string = `SELECT * FROM Account WHERE Username LIKE ?`;
    const valuesToEscape: any[] = [username];
    
    try {
        // logger.info(`Username: ${username}, Password: ${password}`);
        // console.log(`Username: ${username}, Password: ${password}`);

        const queryResult = await handleSqlQuery(sqlQuery, valuesToEscape);
        // console.log(`queryresult:`, queryResult);

        if (queryResult.length === 0) { // If zero it means there is no user with the username passed in the body
            return res.status(401).json({ isSuccess: false, message: 'Wrong Username or Password' });
        }

        const user = queryResult[0];
        if(verifyPassword(user.HashPassword, password)){ // HERE YOU WILL NEED TO USE THE BCRYPT PASSWORD TO COMPARE THE HASH WITH THE HASH
            return res.status(401).json({ isSuccess: false, message: 'Wrong Username or Password' });
        }

        // Store minimal user info in session
        req.session.user = { accountId: user.AccountId, username: user.Username, isAdmin: user.IsAdmin};
        req.session.isAuth = true;
        res.status(200).json({ isSuccess: true, message: 'User identified' });
    } catch (error: any) {
        logger.error('DB error: ', error);
        return res.status(500).json({ isSuccess: false, message: 'Internal server error' });    }
}

export async function logoutHandler(req: Request, res: Response) {
    req.session.destroy((error) => {
        if (error) return res.status(500).json({ isSuccess: true, message: 'Logout failed' });
        res.clearCookie('air-quality-site');
        res.status(200).json({ isSuccess: true, message: 'Logged out' });
    });
}