import { Schema } from "mongoose";
import { io, userSocketMap } from "../..";
import { cloudnary } from "../libs";
import { Message, User } from "../models";

export default class MessageController {
  static getUsersList = async (req, res) => {
    try {
      const userId = req?.user?._id;
      const users = await User.find({ _id: { $ne: userId } }).select(
        "-password",
      );
      //   Count of unseen messages

      const unseenMessages: { [userId: string]: number } = {};
      const promises = users.map(async (user) => {
        const count = await Message.countDocuments({
          receiverId: userId,
          senderId: user._id,
          seen: false,
        });
        unseenMessages[user?._id.toString()] = count;
      });
      await Promise.all(promises);
      return res.json({ status: true, data: { users, unseenMessages } });
    } catch (error: any) {
      console.error("error :", error);
      return res.json({
        status: false,
        message: "Something went wrong",
        error,
      });
    }
  };

  static getMessages = async (req, res) => {
    try {
      const { id: userId } = req.params;
      const id = req?.user?._id;

      const messages = await Message.find({
        $or: [
          { senderId: id, receiverId: userId },
          { senderId: userId, receiverId: id },
        ],
      }).sort({ createdAt: 1 });
      await Message.updateMany(
        {
          $or: [
            { senderId: id, receiverId: userId },
            { senderId: userId, receiverId: id },
          ],
        },
        { $set: { seen: true } },
      );
      return res.json({ status: true, data: { messages } });
    } catch (error) {
      console.error("error :", error);
      res.json({ status: false, message: "Something went wrong", error });
    }
  };

  // mark messages as seen

  static markSeen = async (req, res: any) => {
    try {
      const { id: messageId } = req.params;
      await Message.findByIdAndUpdate(messageId, { seen: true });

      return res.json({ status: true });
    } catch (error) {
      console.error("error :", error);
      res.json({ status: false, message: "Something went wrong", error });
    }
  };

  static sendMessage = async (req: any, res: any) => {
    try {
      const { text, image } = req?.body;
      const receiverId = req?.params?.id;
      const senderId = req?.user?._id;
      let imageUrl;
      if (image) {
        const uploadRes = await cloudnary.uploader.upload(image);
        imageUrl = uploadRes.secure_url;
      }
      const message = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });

      // emit new message to the receiver 's socket
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        // const res = io.to(receiverSocketId).emit("new-message", message);
        const res = receiverSocketId?.emit("new-message", message);
      }

      return res.json({ status: true, data: message });
    } catch (error) {
      res.json({ status: false, message: "Something went wrong", error });
    }
  };
}
