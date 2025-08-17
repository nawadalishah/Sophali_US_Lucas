import { UserType } from "../../@types";
import { userService } from "../service";


class EndUserController {
    async signup(req: any, res: any) {
        try {
            // const profileData = req.body;
            // const user = await userService.signup(profileData, UserType.ENDUSER);
            // res.status(200).json(user);
        } catch (error:any) {
            console.log("error", error);
            res.status(500).json({ message: error.message });
        }
    }
    async signin(req: any, res: any) {
        try {
            const profileData = req.body;
            const user = await userService.signin(profileData, UserType.ENDUSER);
            res.status(200).json(user);
        } catch (error:any) {
            console.log("error", error);
            res.status(500).json({ message: error.message });
        }
    }
    
}

export default EndUserController;