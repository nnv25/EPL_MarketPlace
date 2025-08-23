import express from "express"
import { addRating, getAverageRating, limitListRating, listRatingById, updateStoreComment } from "../controllers/ratingController.js";

const ratingRouter = express.Router()

ratingRouter.post("/addratings", addRating);
ratingRouter.get("/average/:shopId", getAverageRating);
ratingRouter.get("/limitlist/:shopId", limitListRating);
ratingRouter.get("/listrating/:ratingId", listRatingById);
ratingRouter.put('/update/:ratingId', updateStoreComment);

export default ratingRouter;