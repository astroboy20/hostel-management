
import { Document, model, Model, Schema } from "mongoose";


export interface IUser extends Document {
    firstName: string;
    lastName: string;
    matricNumber: string;
    email: string
    department: string;
    level: string
    password: string
    currentHostel?: Schema.Types.ObjectId;
    isAdmin: boolean;
    refreshToken?: string;
}

export interface IHostel extends Document {
    name: string;
    type: 'Standard' | 'Premium' | 'Deluxe';
    price: number;
    capacity: string;
    available: number;
    total: number;
    description: string;
    features: string[];
    image:string

}

export interface IPayment extends Document {
    user: Schema.Types.ObjectId;
    hostel: Schema.Types.ObjectId;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    reference: string;
}

const userSchema = new Schema<IUser>({
    firstName: String,
    lastName: String,
    matricNumber: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    department: String,
    password: { type: String, unique: true, required: true },
    level: String,
    currentHostel: { type: Schema.Types.ObjectId, ref: 'Hostel' },
    isAdmin: { type: Boolean, default: false },
    refreshToken: String,
}, { timestamps: true })

const hostelSchema = new Schema<IHostel>({
    name: { type: String, required: true },
    type: { type: String, enum: ['Standard', 'Premium', 'Deluxe'], required: true },
    price: { type: Number, required: true },
    capacity: { type: String, required: true },
    available: { type: Number, required: true },
    total: { type: Number, required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    image: { type: String, required: true }
});

const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel' },
    amount: Number,
    status: { type: String, default: 'pending' },
    reference: String,
});


export const User = model<IUser>('User', userSchema);
export const Hostel = model<IHostel>('Hostel', hostelSchema);
export const Payment = model<IPayment>('Payment', paymentSchema);