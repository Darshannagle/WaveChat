import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, minlength: 6 },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  {
    timestamps: true,
    deleteAt: true,
  },
);

export default model("User", UserSchema, "User");
