import { NextFunction, Response } from "express";
import { decodeToken } from "../libs/Auth";
import User from "../models/User";
import cloudnary from "../libs/Cloudnary";
import { Schema } from "mongoose";

export const auth = async (req, res, next: NextFunction) => {
  try {
    const token = req?.headers?.token;
    if (!token) {
      res.status(400).json({ status: false, messaage: "Token not found" });
      return;
    }
    const decoded: any = decodeToken(token);

    const user = await User.findById(decoded?.id).select("-password");
    if (!user) {
      return res.json(400).json({ status: false, messaage: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const checkAuth = (req, res, next: NextFunction) => {
  return res.json({ status: true, user: req?.user });
};
