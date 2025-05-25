import { RequestHandler } from "express";
import { Hostel } from "../models/models";


export const getHostelHandler: RequestHandler = async (req, res) => {
    try {
        const hostels = await Hostel.find();
        res.json(hostels);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching hostels' });
    }
}
