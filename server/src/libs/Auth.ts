import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
export const generateToken = (userId: ObjectId | string) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "9999999999999d",
  });
  return token;
};

export const decodeToken = (token: string) => {
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  return decoded;
};
