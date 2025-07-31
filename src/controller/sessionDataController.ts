import { Request, Response } from 'express';


export function sessionData(req: Request, res: Response) {
    if (req.session?.isAuth) {
        res.json({ isAuth: req.session.isAuth, user: req.session.user });
    } else {
        res.json({ isAuth: false });
    }
}