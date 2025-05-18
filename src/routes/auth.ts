import { RequestHandler } from "express";
import { User } from "../models/models";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { config } from "../config";

// Extend Express Request type
declare global {
    namespace Express {
      interface Request {
        user?: {
          _id: string;
          matricNumber: string;
          isAdmin: boolean;
        };
      }
    }
  }

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

export const refreshTokenHandler: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        res.status(401).json({ error: "Refresh Token required" })
        return
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as { _id: string }
        const user = await User.findById(decoded._id)
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ error: 'Invalid refresh token' });
            return
        }

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        user.refreshToken = newRefreshToken
        await user.save()

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
}

//validate token
export const validateRefreshTokenHandler: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body
    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as { _id: string }
        const user = await User.findById(decoded._id)
        const isValid = !!user && user.refreshToken === refreshToken;
        res.json({ valid: isValid });
    } catch (error) {
        res.json({ valid: false });
    }
}

//logout
export const logoutHandler:RequestHandler = async(req,res)=>{

    try {
        await User.findByIdAndUpdate(req?.user?._id, {
          $unset: { refreshToken: 1 }
        });
        res.json({ message: 'Successfully logged out' });
      } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
      }
}


export const adminLoginHandler: RequestHandler = async (req, res) => {
    try {
        const { username, password } = req.body;

        const adminUser = await User.findOne({
            matricNumber: username,
            isAdmin: true
        });

        if (!adminUser) {
            res.status(401).json({ error: 'Invalid admin credentials' });
            return
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid admin credentials' });
            return
        }

        const accessToken = generateAccessToken(adminUser);
        const refreshToken = generateRefreshToken(adminUser);

        adminUser.refreshToken = refreshToken;
        await adminUser.save();

        res.json({
            accessToken,
            refreshToken,
            isAdmin: true
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Server error during admin login' });
    }
}

// Create initial admin user (run once)
async function createAdmin() {
    const exists = await User.findOne({ isAdmin: true });
    if (!exists) {
      await User.create({
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