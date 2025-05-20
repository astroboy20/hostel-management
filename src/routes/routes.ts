
import express, { Router } from 'express';
import { adminLoginHandler, loginHandler, logoutHandler, refreshTokenHandler, registerHandler, validateRefreshTokenHandler } from './auth';
import { auth } from '../middleware/auth';

export const router: Router = express.Router();


//user registration  
router.post("/register", registerHandler)
router.post("/login", loginHandler)
router.post("/validate-refreshToken", refreshTokenHandler)
// router.post('/validate-refreshToken', validateRefreshTokenHandler)
router.post('/logout', auth, logoutHandler)
router.post('/admin/login', adminLoginHandler)

