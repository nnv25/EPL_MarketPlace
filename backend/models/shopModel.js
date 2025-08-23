import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    image: { type: String, required: true },
    work_time: {
        weekdays: { type: String, required: true },
        saturday: { type: String, required: true }, 
        sunday: { type: String, required: true }, 
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    delivery: { type: Boolean, required: true }, 
    /*delivery_price: {
        type: Number,
        required: function() { return this.delivery; }, 
        validate: {
            validator: function(v) {
                return v > 0; 
            },
            message: props => `Цена доставки должна быть положительным числом.`
        }
    },*/
    payment_form: { type: String, required: true },
    createdAt: { type: String },
    isBanned: { type: Boolean, default: false },
    balance: {type: Number, default:0 },
    numberOfOrders: { type: Number, default: 0 },
    averageRating: {type: Number, default: 0},
    numFlowers: {type: Number, default: 0},
});

shopSchema.pre('save', function(next) {
    const now = new Date();
    this.createdAt = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    next();
});

const shopModel = mongoose.models.shop || mongoose.model("shop", shopSchema);

export default shopModel;
