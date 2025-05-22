import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/models';

declare module 'express' {
    interface Request {
        user?: {
            _id: string;
            matricNumber: string;
            isAdmin: boolean;
        };
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
        return 
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify access token
        const decoded = jwt.verify(token, config.JWT_SECRET) as {
            _id: string;
            matricNumber: string;
            isAdmin: boolean;
        };

        // Check if user still exists
        const user = await User.findById(decoded._id).select('isAdmin refreshToken');
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return 
        }
        // Attach user to request
        req.user = {
            _id: decoded._id,
            matricNumber: decoded.matricNumber,
            isAdmin: user.isAdmin
        };
        next();
    } catch (error) {
        let errorMessage = 'Invalid token';
        if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token expired';
        } else if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = 'Invalid token signature';
        }

        res.status(401).json({ error: errorMessage });
    }
};

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    auth(req, res, () => {
        if (!req.user?.isAdmin) {
            return res.status(403).json({
                error: 'Forbidden - Admin privileges required'
            });
        }
        next();
    });
};