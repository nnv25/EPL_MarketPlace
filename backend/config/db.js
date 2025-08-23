import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://nikitindamir87:8hYI8BvvGntUptnI@cluster0.s7vns2w.mongodb.net/?');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};