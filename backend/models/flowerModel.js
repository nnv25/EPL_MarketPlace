import mongoose from "mongoose";

const flowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }, 
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    date:{type:Date,default:Date.now},
    shop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'shop', 
        required: true 
    }  
})

const flowerModel = mongoose.models.flower || mongoose.model("flower", flowerSchema);

export default flowerModel;