import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import apiLimiter from "./middleware/rateLimit.js";

import multer from "multer";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

// --- Multer sozlash ---
// uploads papkasi va fayl nomini sozlaymiz
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads papkasi
  },
  filename: function (req, file, cb) {
    // Original nom oldidan vaqt qo‘shamiz (unique bo‘lsin uchun)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// Rate limit (DDOSga qarshi)
app.use("/api", apiLimiter);

// Public static
app.use(express.static("public"));

// Static files uchun — uploads papkasi ochiq bo‘lsin
app.use("/uploads", express.static("uploads"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routesga multer ni qanday kiritish masalasi productRoutes’da bo‘ladi.
// Shu sababli bu yerda multer middleware kiritilmaydi

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/types", typeRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
