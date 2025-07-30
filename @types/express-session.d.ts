import 'express-session';

declare module 'express-session' {
    interface SessionData {
        isAuth?: boolean;
        user?: {
            accountId?: number;
            username?: string;
            isAdmin?: boolean;
        }
    }
}