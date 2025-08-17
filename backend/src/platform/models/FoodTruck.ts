import { Schema, model } from 'mongoose';

const FoodTruckSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: String, required: true, ref: "User" },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "default_truck_image.png"},
  star: { type: Number, default: 4.5 },
  offers: { type: [String], required: true },
  maxPrice: { type: Number, required: true },
  minPrice: { type: Number, required: true },
  freeDelivery: { type: Boolean, default: false },
  foods: { type: [String], required: true },
  active: { type: Boolean, default: false }
});

export const FoodTruckModel = model('FoodTruck', FoodTruckSchema); 