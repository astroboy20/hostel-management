
import express, { Router } from 'express';
import { adminLoginHandler, loginHandler, logoutHandler, refreshTokenHandler, registerHandler, userDataHandler, validateRefreshTokenHandler } from './auth';
import { auth } from '../middleware/auth';
import { initiatePaymentHandler } from './payment';
import { getHostelHandler } from './hostels';

export const router: Router = express.Router();


//user registration  
router.post("/register", registerHandler)
router.post("/login", loginHandler)
router.post("/validate-refreshToken", refreshTokenHandler)
router.post('/logout', auth, logoutHandler)
router.get('/user-details', auth, userDataHandler)
router.get('/hostels', auth, getHostelHandler)
router.post('/admin/login', adminLoginHandler)
router.post("/initiate-payment", auth, initiatePaymentHandler)

