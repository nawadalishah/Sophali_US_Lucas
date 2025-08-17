import { Schema, model } from "mongoose";


const CategorySchema = new Schema({
    id: { type: String, require: true },
    foodTruckId: { type: String, require: true, ref: "FoodTruck" },
    name: { type: String, require: true },
})


export const CategoryModel = model("Category", CategorySchema);
