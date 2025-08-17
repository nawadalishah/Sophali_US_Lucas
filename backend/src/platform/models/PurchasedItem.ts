import { Schema, model } from 'mongoose';
import { Country, Gender, UserType, Size, RuleInterface } from '../../@types';


const Rule = new Schema<RuleInterface>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const PurchasedItemSchema = new Schema({
  id: { type: String, required: true},
  owner: { type: String, required: true, ref: "User" },
  foodId: { type: String, required: true, ref: "Food" },
  amount: { type: Number, required: true },
  sizeIndex: { type: Number, required: true },
  spizeLevelIndex: { type: Number, required: true },
  addOns: { type: [Number] , default: []},
  isGift: { type: Boolean, default: false },
  isCoupon: { type: Boolean, default: false },
  rules: { type: [Rule], default: [] },
});

export const PurchasedItemModel = model('PurchasedItem', PurchasedItemSchema); 