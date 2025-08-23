import express from "express"
import { addShop, getShopById, limitListShop, listShop, removeShop, updateShop, banShop, limitListBannedShop, checkShopStatus, initialPayment, UkassaWebHook, getShopBalance, updateShopBalance } from "../controllers/shopController.js"
import multer from "multer"

const shopRouter = express.Router();

//Image Storage Engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

shopRouter.post("/add",upload.single("image"),addShop);
shopRouter.get("/list", listShop);
shopRouter.get("/id", getShopById);
shopRouter.post("/remove", removeShop);
shopRouter.put("/update", upload.single("image"), updateShop);
shopRouter.get("/limitlist", limitListShop);
shopRouter.post("/ban-shop", banShop);
shopRouter.get("/limitlistBanned", limitListBannedShop);
shopRouter.get("/status/:shopId", checkShopStatus);
shopRouter.post("/replenish", initialPayment);
shopRouter.post("/yookassa-webhook", UkassaWebHook);
shopRouter.post("/balance", getShopBalance);
shopRouter.post("/update-balance", updateShopBalance);

export default shopRouter;