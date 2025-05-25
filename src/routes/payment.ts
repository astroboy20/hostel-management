import express, { RequestHandler } from "express"
import { initiatePayment } from "../services/paystack"
import { Hostel, Payment } from "../models/models"

// Extend Express User type to include email




export const initiatePaymentHandler: RequestHandler = async (req, res) => {

    try {
        const { hostelId } = req.body
        const hostel = await Hostel.findById(hostelId)
        if (!hostelId) {
            res.status(404).json({ error: "Hostel not found" })
            return
        }
        const reference = `GMA-HOSTEL-${Date.now()}`

        const payamentData = await initiatePayment({
            email: req.user?.email,
            amount: hostel ? hostel.price : 0,
            reference
        })

        await Payment.create({
            user: req.user?._id,
            hostel: hostelId,
            amount: hostel ? hostel.price : 0,
            reference
        })

        res.json({
            authorizationUrl: payamentData.data.authorization_url,
            reference: payamentData.data.reference
        })


    } catch (error) {
        console.error('Payment init error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
}