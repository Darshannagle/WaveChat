import { Router } from "express";
import { UserController } from "../Controllers";
import { auth, checkAuth } from "../middlewares/auth";
const route = Router();

route.post("/signup", UserController.signup);
route.post("/login", UserController.login);
route.put("/update-profile", auth, UserController.updateProfile);
route.get("/check-auth", auth, checkAuth);

export default route;
