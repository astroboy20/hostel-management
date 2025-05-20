// utils/jwt.ts
import jwt from "jsonwebtoken";
import { config } from "../config";


export const generateAccessToken = (user: {
    _id: string | unknown;
    matricNumber: string;
    isAdmin: boolean;
}): string => {
    return jwt.sign(
        {
            _id: user._id,
            matricNumber: user.matricNumber,
            isAdmin: user.isAdmin,
        },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    );
};


export const generateRefreshToken = (user: { _id: string | unknown }): string => {
    return jwt.sign(
        { _id: user._id },
        config.JWT_SECRET,
        { expiresIn: "1m" }
    );
};
