import dotenv from "dotenv";
dotenv.config();
interface EnvVariables {
    PORT: number
    MONGODB_URI: string
    JWT_SECRET: string
    PAYSTACK_SECRET_KEY: string;
}

export const config: EnvVariables = {
    PORT: parseInt(process.env.PORT || '5000'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_db',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || '',
}