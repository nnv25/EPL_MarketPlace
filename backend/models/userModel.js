import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    cartData: { type: Object, default: {} },
    numberOfOrders: { type: Number, default: 0 },
    orderTotal: { type: Number, default: 0 },
    createdAt: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isBanned: { type: Boolean, default: false }
}, { minimize: false });

userSchema.pre('save', function(next) {
    const now = new Date();
    this.createdAt = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;