import { Schema, model } from 'mongoose';
import { OrderStatus } from '../../@types';

export interface OrderFood {
  name: string;
  amount: number;
}

const OrderHistorySchema = new Schema({
  orderOwner: { type: String, required: true, ref: "User" },
  foodItemId: { type: String, required: true, ref: "Food" },
  quantity: { type: Number, required: true },
  totalMoney: { type: Number, required: true },
  status: { type: Number, enum: Object.values(OrderStatus), required: true },
  time: { type: Date, required: true, default: Date.now() },
});

export const OrderHistoryModel = model('OrderHistory', OrderHistorySchema); 