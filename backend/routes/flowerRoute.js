import express from "express";
import { addFlower, getFlowerById, removeFlower, updateFlower, listFlowersWithPagination} from "../controllers/flowerController.js";
import multer from "multer";

const flowerRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploadsFlower",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
flowerRouter.post("/add", upload.array("images", 3), addFlower);
flowerRouter.get("/limitlist/:shopId", listFlowersWithPagination);
flowerRouter.get("/flowers/:id/:shopId", getFlowerById);
flowerRouter.delete("/flowers/:id/:shopId", removeFlower);
flowerRouter.put("/flowers/:id/:shopId", upload.array("images", 3), updateFlower);

export default flowerRouter;