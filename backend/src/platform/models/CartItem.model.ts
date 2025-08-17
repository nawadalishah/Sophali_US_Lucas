import { Schema, model } from 'mongoose';
import { CartItemType } from '../../@types';


const CartItemSchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true, ref: "User" },
  foodItemId: { type: String, required: true, ref: "Food" },
  quantity: { type: Number, required: true }, 
  spiceLevel: { type: String, required: true },
  size: { type: String, required: true },
  addons: { type: Number, required: true },
  type: { type: Number, enum: Object.values(CartItemType), default: CartItemType.EATNOW },
});

export const CartItemModel = model('CartItem', CartItemSchema); 