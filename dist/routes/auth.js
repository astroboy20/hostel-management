"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginHandler = exports.logoutHandler = exports.validateRefreshTokenHandler = exports.refreshTokenHandler = exports.loginHandler = exports.registerHandler = void 0;
const models_1 = require("../models/models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const config_1 = require("../config");
const registerHandler = async (req, res) => {
    try {
        const { firstName, lastName, matricNumber, email, level, department, currentHostel, password } = req.body;
        //existing user
        const existingUser = await models_1.User.findOne({
            $or: [
                { email: email },
                { matricNumber: matricNumber }
            ]
        });
        if (existingUser) {
            res.status(400).json({ error: "User with this email exist already" });
            return;
        }
        //hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        //create user
        const user = new models_1.User({
            firstName, lastName, matricNumber, email, level, department, currentHostel, password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};
exports.registerHandler = registerHandler;
const loginHandler = async (req, res) => {
    try {
        const { matricNumber, password } = req.body;
        //find user
        const user = await models_1.User.findOne({ matricNumber });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        //check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // tokens
        const accessToken = (0, jwt_1.generateAccessToken)(user);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user);
        user.refreshToken = refreshToken;
        await user.save();
        res.json({
            accessToken,
            refreshToken,
            isAdmin: user.isAdmin
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during Login' });
    }
};
exports.loginHandler = loginHandler;
const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ error: "Refresh Token required" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.JWT_SECRET);
        const user = await models_1.User.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ error: 'Invalid refresh token' });
            return;
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(user);
        user.refreshToken = newRefreshToken;
        await user.save();
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};
exports.refreshTokenHandler = refreshTokenHandler;
//validate token
const validateRefreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.JWT_SECRET);
        const user = await models_1.User.findById(decoded._id);
        const isValid = !!user && user.refreshToken === refreshToken;
        res.json({ valid: isValid });
    }
    catch (error) {
        res.json({ valid: false });
    }
};
exports.validateRefreshTokenHandler = validateRefreshTokenHandler;
//logout
const logoutHandler = async (req, res) => {
    try {
        await models_1.User.findByIdAndUpdate(req?.user?._id, {
            $unset: { refreshToken: 1 }
        });
        res.json({ message: 'Successfully logged out' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};
exports.logoutHandler = logoutHandler;
const adminLoginHandler = async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminUser = await models_1.User.findOne({
            matricNumber: username,
            isAdmin: true
        });
        if (!adminUser) {
            res.status(401).json({ error: 'Invalid admin credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, adminUser.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid admin credentials' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(adminUser);
        const refreshToken = (0, jwt_1.generateRefreshToken)(adminUser);
        adminUser.refreshToken = refreshToken;
        await adminUser.save();
        res.json({
            accessToken,
            refreshToken,
            isAdmin: true
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Server error during admin login' });
    }
};
exports.adminLoginHandler = adminLoginHandler;
// Create initial admin user (run once)
async function createAdmin() {
    const exists = await models_1.User.findOne({ isAdmin: true });
    if (!exists) {
        await models_1.User.create({
        // matricNumber: 'admin001',
        // password: await bcrypt.hash('adminPassword', 10),
        // fullName: 'System Admin',
        // faculty: 'Administration',
        // department: 'IT',
        // isAdmin: true
        });
    }
}
// router.get('/admin/dashboard', adminAuth, async (req: Request, res: Response) => {
//     try {
//       const hostels = await Hostel.find();
//       const users = await User.find().select('-password -refreshToken');
//       const payments = await Payment.find().populate('user hostel');
//       res.json({
//         stats: {
//           totalHostels: hostels.length,
//           totalUsers: users.length,
//           totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0)
//         },
//         recentPayments: payments.slice(-5)
//       });
//     } catch (error) {
//       console.error('Admin dashboard error:', error);
//       res.status(500).json({ error: 'Server error fetching admin data' });
//     }
//   });
