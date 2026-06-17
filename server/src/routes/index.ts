import { Router } from "express";
import userRouter from "./User";
import messageRouter from "./Message";

const route = Router();

route.use("/user", userRouter);
route.use("/message", messageRouter);
route.use("*", (req, res) => res.json({ status: false, message: "Not found" }));
export default route;
