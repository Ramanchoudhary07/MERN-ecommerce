import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      console.log("no access token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("no user");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectRoute middleware", error);
    res.status(500).json({ message: error.message });
  }
};

export const adminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.role !== "admin") {
      return res.status(401).json({ message: "access denied - admin only" });
    }
    next();
  } catch (error) {
    console.log("error in adminRoute middleware", error);
    res.status(500).json({ message: error.message });
  }
};
