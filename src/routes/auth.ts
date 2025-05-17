import { RequestHandler } from "express";
import { User } from "../models/models";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerHandler: RequestHandler = async (req, res) => {
    try {
        const { firstName, lastName, matricNumber, email, level, department, currentHostel, password } = req.body
        //existing user
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { matricNumber: matricNumber }
            ]
        })

        if (existingUser) {
            res.status(400).json({ error: "User with this email exist already" });
            return;
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create user
        const user = new User({
            firstName, lastName, matricNumber, email, level, department, currentHostel, password: hashedPassword
        })

        await user.save()
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });

    }
};



export const loginHandler: RequestHandler = async (req, res) => {
    try {
        const { matricNumber, password } = req.body

        //find user
        const user = await User.findOne({ matricNumber })
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' })
            return
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return
        }

        // tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken
        await user.save()
        res.json({
            accessToken,
            refreshToken,
            isAdmin: user.isAdmin
        });



    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during Login' });
    }
}