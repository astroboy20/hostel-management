import express from "express"
import { adminAuth } from "../middleware/auth"
import { seedHotels } from "../services/hotels"

const router = express.Router()

router.post("/seed-hostels", adminAuth, async (req, res) => {
    try {
        const result = await seedHotels()
        res.json({
            success: true,
            message: result ? `${result.length} hostels seeded` : 'Hostels already exist',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error seeding hostels',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

export default router