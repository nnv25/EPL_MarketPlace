import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import shopRouter from "./routes/shopRoute.js";
import flowerRouter from "./routes/flowerRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import roleRouter from "./routes/roleRoute.js";
import ratingRouter from "./routes/ratingRoute.js";

// Получаем путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app config
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//api endpoints shops
app.use("/api/shop", shopRouter);
app.use("/images", express.static('uploads'));

//api endpoints flowers
app.use("/api/flower", flowerRouter);
app.use("/flower-images", express.static('uploadsFlower'));

//api endpoints user
app.use("/api/user", userRouter);

//api endpoints cart
app.use("/api/cart", cartRouter)

//api endpoints order
app.use("/api/order",orderRouter)

//api endpoints role
app.use("/api/role",roleRouter)

//api endpoints rating
app.use("/api/rating", ratingRouter)


// Обслуживаем статические файлы из папки view
app.use(express.static(path.join(__dirname, 'view')));

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});