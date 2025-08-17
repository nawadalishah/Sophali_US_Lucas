import { Schema, model } from 'mongoose';

const AddOnSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true }, 
  description: { type: String, required: true },
  foodTruckId: { type: String, required: true, ref: "FoodTruck" },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

export const AddOnModel = model('AddOn', AddOnSchema); 