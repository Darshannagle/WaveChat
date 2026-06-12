import mongoose from "mongoose";
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/wavechat";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Database connection error:", err);
    });

    await mongoose.connect(DB_URL);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
