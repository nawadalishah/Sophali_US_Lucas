import { UserType } from "../../@types";
import { foodTruckService, menuService, userService } from "../service";



class MerchantController {
    async signup(req: any, res: any) {
        try {
            const data = req.body;
            const merchant = await userService.signup(data);
            res.status(200).json(merchant);
        } catch (error:any) {
            console.log("error", error);
            res.status(500).json({ message: error.message });
        }
    }
    async signin(req: any, res: any) {
        try {
            const { name, password } = req.body;
            const merchant = await userService.signin(name, password);
            res.status(200).json(merchant);
        } catch (error:any) {
            console.log("error", error);
            res.status(500).json({ message: error.message });
        }
    }

    async addCategory(req: any, res: any) {
        try {
            const { name, foodTruckId } = req.body;
            const category = await menuService.addCategory(name, foodTruckId);
            res.status(200).json(category);
        } catch (error:any) {
            console.log("error", error);
            res.status(500).json({ message: error.message });
        }
    }

    async makeMyTruck(req: any, res: any) {
        try {
            const data = req.body;
            const response = await foodTruckService.registerTruck(data);
            res.status(200).json(response);
        } catch (error: any) {
            console.log("error", error);
            res.status(500).json({ message: error.message });
        }
    }

    async getMyTruck(req: any, res: any) {
        try {
            const { owner } = req.body;
            const foodTruck = await foodTruckService.getMyTruck(owner);
            res.status(200).json(foodTruck);
        } catch (error: any) {
            console.log("error", error);
            res.status(500).json({ message: error. message})
        }
    }
    
}

export default MerchantController;