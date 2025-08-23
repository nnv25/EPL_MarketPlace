import express from "express"
import { getUserRole, loginUser, registerShopUser } from "../controllers/roleController.js"

const roleRouter = express.Router();

roleRouter.post("/shop/register", registerShopUser);
roleRouter.post("/login", loginUser);
roleRouter.post("/auth/:email", getUserRole);

export default roleRouter