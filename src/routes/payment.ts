import express, { RequestHandler } from "express"
import { initiatePayment } from "../services/paystack"
import { Hostel } from "../models/models"

// Extend Express User type to include email
declare global {
    namespace Express {
        interface User {
            _id: string;
            matricNumber: string;
            isAdmin: boolean;
            email: string;
        }
    }
}



export const initiatePaymentHandler: RequestHandler = async (req, res) => {
    const { hostelId } = req.body
    const hostel = await Hostel.findById(hostelId)
    if (!hostelId) {
        res.status(404).json({ error: "Hostel not found" })
        return
    }
    const reference = `GMA-HOSTEL-${Date.now()}`

    // try {
    //     const payamentData = await initiatePayment({
    //         email: req.user?.email,
    //         amount: hostel ? hostel.price : 0,
    //         reference
    //     })
    // }
}