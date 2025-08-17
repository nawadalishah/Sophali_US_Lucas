import { Schema, model } from 'mongoose';


const PurchaseHistory = new Schema({
  purchaser: { type: String, required: true, ref: "User" },
  foodItemId: { type: String, required: true, ref: "Food" },
  quantity: { type: Number, required: true },
  totalMoney: { type: Number, required: true },
  time: { type: Date, required: true, default: Date.now() },
});

export const PurchaseHistoryModel = model('PurchaseHistory', PurchaseHistory); 