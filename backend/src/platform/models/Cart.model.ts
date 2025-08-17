import { Schema, model } from 'mongoose';

const CartSchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true }, 
  cartItems: { type: [String], required: true },
  offers: { type: [String]}
});

export const CartModel = model('Cart', CartSchema); 