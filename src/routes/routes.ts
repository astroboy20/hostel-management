
import express, { Request, Response, Router, NextFunction, RequestHandler } from 'express';
import { User } from '../models/models';
import { loginHandler, registerHandler } from './auth';

export const router: Router = express.Router();


//user registration  
router.post("/register", registerHandler)
router.post("/login", loginHandler)
