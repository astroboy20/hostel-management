"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: parseInt(process.env.PORT || '5000'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_db',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || '',
};
