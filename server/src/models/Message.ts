import { model, Schema } from "mongoose";
import { ObjectId } from "mongoose";
const messageSchema = new Schema(
  {
    senderId: { type: Schema.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default model("Message", messageSchema, "Message");
