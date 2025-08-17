import { Schema, model } from 'mongoose';
import { Country, Gender, UserType } from '../../@types';


export interface Wallet {
  walletName: string;
  balance: number;
}

const WalletSchema = new Schema({
  walletName: { type: String, required: true },
  balance: { type: Number, required: true },
});

const UserSchema = new Schema({
  id: { type: String, required: true},
  stripe_account_id: { type: String, default: "" }, 
  // user_type: { type: Number, required: true }, // Temporarily remove enum validation
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  // screenName: { type: String, required: true },
  // gender: { type: String, enum: Object.values(Gender), required: true },
  // password: { type: String, required: true },
  // email: { type: String, required: true },
  // phone_number: { type: String, required: true },
  // avatar: { type: String, default: "avatar.png" },
  // address: { type: String, required: true },
  // country: { type: Number, enum: Object.values(Country), required: true },
  // deliveryPoints: { type: [String], default: [] },
  // wallet: { type: [WalletSchema], required: true },
  // isBanned: { type: Boolean, default: true }
});

export const UserModel = model('User', UserSchema); 