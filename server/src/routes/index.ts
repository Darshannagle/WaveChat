import { Router } from "express";
import userRouter from "./User";
import messageRouter from "./Message";

const route = Router();

route.use("/user", userRouter);
route.use("/message", messageRouter);

export default route;
