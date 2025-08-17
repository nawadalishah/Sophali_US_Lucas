import { Schema, model } from 'mongoose';
import { Country, Gender, UserType, Size, RuleInterface, OrderStatus } from '../../@types';


const Rule = new Schema<RuleInterface>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const OrderSchema = new Schema({
  id: { type: String, required: true},
  purchasedItemId: { type: String, required: true, ref: "PurchasedItem"},
  orderStatus: { type: Number, enum: Object.values(OrderStatus), default: OrderStatus.REQUEST },
  time: { type: Date , default: Date.now() }
});

export const OrderModel = model('Order', OrderSchema); 