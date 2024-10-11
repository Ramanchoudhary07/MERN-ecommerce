import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponsRoutes from "./routes/coupons.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticRoutes from "./routes/analytic.route.js";

import { connectDb } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(`/api/auth`, authRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/cart`, cartRoutes);
app.use(`/api/coupons`, couponsRoutes);
app.use(`/api/payments`, paymentRoutes);
app.use(`/api/analytics`, analyticRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

app.listen(PORT, () => {
  connectDb();
  console.log(`server is running on port:${PORT}`);
});
