import { Request, Response } from 'express';
import { isPasswordCorrect } from '../helper/crypt';
import logger from "../helper/logger";
import Db from "../model/db";

const db = new Db();

export async function loginHandler(req: Request, res: Response) {
    const { username, password } = req.body;
    const result = await db.accounts.getUserDataFromUsername(username);

    if (!result.isSuccess) {
        return res.status(500).json({ isSuccess: result.isSuccess, message: result.message });
    }

    if (!isPasswordCorrect(password, result.user.HashPassword)) {
        return res.status(401).json({ isSuccess: false, message: 'Wrong Username or Password' });
    }

    // Store minimal user info in session
    req.session.user = { accountId: result.user.AccountId, username: result.user.Username, isAdmin: result.user.IsAdmin };
    req.session.isAuth = true;
    res.status(200).json({ isSuccess: result.isSuccess, message: result.message });
}

export async function logoutHandler(req: Request, res: Response) {
    req.session.destroy((error) => {
        if (error) {
            logger.error('logoutHandler: ', error);
            return res.status(500).json({ isSuccess: false, message: 'Logout failed' });
        }
        res.clearCookie('air-quality-site');
        res.status(200).json({ isSuccess: true, message: 'Logged out' });
    });
}