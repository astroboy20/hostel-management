"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const auth_2 = require("../middleware/auth");
exports.router = express_1.default.Router();
//user registration  
exports.router.post("/register", auth_1.registerHandler);
exports.router.post("/login", auth_1.loginHandler);
exports.router.post("/refreshToken", auth_1.refreshTokenHandler);
exports.router.post('/validate-refresh', auth_1.validateRefreshTokenHandler);
exports.router.post('/logout', auth_2.auth, auth_1.logoutHandler);
exports.router.post('/admin/login', auth_1.adminLoginHandler);
