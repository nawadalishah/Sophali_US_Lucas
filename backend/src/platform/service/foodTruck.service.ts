import { foodTruckDA } from "../data-access";
import { v4 as uuidv4 } from 'uuid';

class FoodTruckService {

    async getMyTruck(owner: string) {
        const data = await foodTruckDA.findOne({ owner });
        return data;
    }
    async registerTruck(foodTruck:any) {
        const id = uuidv4();
        const data: any = await foodTruckDA.create({ id, ...foodTruck, });
        return {id, ...foodTruck};
    }

    async getFoodTrucks(filter: any = {}) {
        const data = await foodTruckDA.findAll(filter);
        return data;
    }
    
}

export default FoodTruckService;