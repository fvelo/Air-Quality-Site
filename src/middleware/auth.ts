import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction){
    if (!req.session.isAuth) {
        // return res.redirect(`/login`);
        return res.status(401).json({ message: 'Authentication required' }).redirect('/login');
    }
    next();
}