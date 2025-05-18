"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
// utils/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        matricNumber: user.matricNumber,
        isAdmin: user.isAdmin,
    }, config_1.config.JWT_SECRET, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ _id: user._id }, config_1.config.JWT_SECRET, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
