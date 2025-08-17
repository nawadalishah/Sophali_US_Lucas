import express from "express";
import { endUserController } from "../platform/controller";

const endUserRouter = express.Router();

endUserRouter.post("/register", endUserController.signup.bind(endUserController));
endUserRouter.post("/login", endUserController.signin.bind(endUserController));

export default endUserRouter;