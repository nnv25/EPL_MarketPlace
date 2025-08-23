import userModel from "../models/userModel.js"

//add items to user cart
const addToCart = async(req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Добавлено в корзину"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Ошибка"})
    }
}

//remove items from user cart
const removeFromCart = async(req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Удалено из корзины"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Ошибка"})
    }
}

//fetch user cart data
/*const getCart = async(req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Ошибка"})
    }
}*/
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId не передан" });
        }

        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Ошибка" });
    }
};
export {addToCart, removeFromCart, getCart}