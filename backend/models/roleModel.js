import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const roleSchema = new mongoose.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type:String, enum:["admin", "shop"], required:true},
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }
})

// Перед сохранением хэшируем пароль
roleSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
});

const roleModel = mongoose.models.role || mongoose.model("role", roleSchema);
export default roleModel;