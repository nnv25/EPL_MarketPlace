import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, 
    items:{type:Array,required:true},
    shop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'shop', 
        required: true 
    },
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Заказ в обработке"},
    date:{type:Date,default:Date.now},
    payment:{type:String,required:true},
    comment:{type:String},
    deliveryOption: { 
        type: String, 
        enum: ["самовывоз", "доставка"], 
        default: "самовывоз" 
    }, 
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);
export default orderModel;