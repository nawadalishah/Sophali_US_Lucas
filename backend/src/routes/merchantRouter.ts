import express from "express";
import { merchantController } from "../platform/controller";

const merchantRouter = express.Router();


merchantRouter.get("/test", (req, res) => {
    res.status(200).json(3);
});
merchantRouter.post("/register", merchantController.signup.bind(merchantController));
merchantRouter.post("/login", merchantController.signin.bind(merchantController));
merchantRouter.post("/addCategory", merchantController.addCategory.bind(merchantController));

export default merchantRouter;
