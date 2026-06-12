import { Router } from "express";
import { auth } from "../middlewares/auth";
import { MessageController } from "../Controllers";
import message from "../models/Message";

const messageRouter = Router();

messageRouter.get("/get-users", auth, MessageController.getUsersList);
messageRouter.get("/:id", auth, MessageController.getMessages);
messageRouter.put("/mark-seen/:id", auth, MessageController.markSeen);
messageRouter.post("/send-message/:id", auth, MessageController.sendMessage);

export default messageRouter;
