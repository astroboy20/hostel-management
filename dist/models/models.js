"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.Hostel = exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    matricNumber: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    department: String,
    password: { type: String, unique: true, required: true },
    level: String,
    currentHostel: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Hostel' },
    isAdmin: { type: Boolean, default: false },
    refreshToken: String,
}, { timestamps: true });
const hostelSchema = new mongoose_1.Schema({
    name: String,
    description: String,
    price: Number,
    availableRooms: Number
});
const paymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    hostel: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Hostel' },
    amount: Number,
    status: { type: String, default: 'pending' },
    reference: String,
});
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.Hostel = (0, mongoose_1.model)('Hostel', hostelSchema);
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
