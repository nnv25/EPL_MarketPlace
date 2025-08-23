import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'shop', required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, 
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    storeComment: { type: String },
});

const ratingModel = mongoose.models.rating || mongoose.model("rating", ratingSchema);

export default ratingModel;