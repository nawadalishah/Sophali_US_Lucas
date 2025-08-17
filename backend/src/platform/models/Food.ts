import { Schema, model } from 'mongoose';
import { AddOn, Size, Tag } from '../../@types';

const AddOnSchema = new Schema<AddOn>({
  element: { type: String, required: true },
  price: { type: Number, required: true },
});

const SizeSchema = new Schema<Size>({
  size: { type: String, required: true },
  price: { type: Number, required: true}
})

const FoodSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  categoryId: { type: String, required: true, ref: "Category" },
  foodTruckId: { type: String, required: true, ref: "FoodTruck" },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  star: { type: Number, default: 4.5 },
  calories: { type: [Number], default: [400, 600] },
  prepareTime: { type: Number, required: true },
  addOns: { type: [AddOnSchema], required: true },
  sizes: { type: [SizeSchema], default: [] },
  spiceLevels: { type: [String], default: []},
  tags: { type: Number, enum: Object.values(Tag), default: Tag.HALAL },
  active: { type: Boolean, default: false },

});

export const FoodModel = model('Food', FoodSchema); 