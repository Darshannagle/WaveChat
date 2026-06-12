import bcrypt from "bcryptjs";
import User from "../models/User";
import { Request, Response } from "express";
import { generateToken } from "../libs/Auth";
import { cloudnary } from "../libs";
import { ObjectId, Schema } from "mongoose";

export default class UserController {
  static signup = async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, bio } = req.body;
      const exist = await User.findOne({ email });
      if (exist)
        return res.json({ status: false, message: "Account already exist" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio,
      });
      const token = generateToken(user?._id?.toString());
      return res.json({
        status: true,
        data: { user, token },
        message: "Account created",
      });
    } catch (error) {
      console.error("error: ", error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error,
      });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.json({ status: false, message: "Account dones not exist" });

      const isMatch = await bcrypt.compare(password, user?.password);

      if (!isMatch)
        return res.json({ status: false, message: "Invalid credentials" });

      const token = generateToken(user?._id.toString());
      return res.json({
        status: true,
        data: { user, token },
        message: "Login successful",
      });
    } catch (error) {
      console.error("error: ", error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error,
      });
    }
  };

  static updateProfile = async (req: Partial<Request | any>, res: Response) => {
    try {
      const { profilePic, fullName, bio } = req.body;
      const id = req?.user?._id;
      let updatedUser;
      if (!profilePic) {
        updatedUser = await User.findByIdAndUpdate(
          id,
          { fullName, bio },
          { new: true },
        );
      } else {
        const upload = await cloudnary.uploader.upload(profilePic, {
          folder: "WaveChat",
        });
        updatedUser = await User.findByIdAndUpdate(
          id,
          { fullName, bio, profilePic: upload.secure_url },
          { new: true },
        );
      }

      return res.json({
        status: true,
        data: { user: updatedUser },
        message: "Profile updated",
      });
    } catch (error) {
      console.error("error: ", error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error,
      });
    }
  };
}
