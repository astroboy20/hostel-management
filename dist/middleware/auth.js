"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const models_1 = require("../models/models");
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify access token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        // Check if user still exists
        const user = await models_1.User.findById(decoded._id).select('isAdmin refreshToken');
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        // Attach user to request
        req.user = {
            _id: decoded._id,
            matricNumber: decoded.matricNumber,
            isAdmin: user.isAdmin
        };
        next();
    }
    catch (error) {
        let errorMessage = 'Invalid token';
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            errorMessage = 'Token expired';
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            errorMessage = 'Invalid token signature';
        }
        res.status(401).json({ error: errorMessage });
    }
};
exports.auth = auth;
const adminAuth = (req, res, next) => {
    (0, exports.auth)(req, res, () => {
        if (!req.user?.isAdmin) {
            return res.status(403).json({
                error: 'Forbidden - Admin privileges required'
            });
        }
        next();
    });
};
exports.adminAuth = adminAuth;
