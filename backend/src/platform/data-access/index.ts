import DataAccess from "./basic";
import { CategoryModel, UserModel, FoodTruckModel, FoodModel, OrderHistoryModel, PurchasedItemModel, OrderModel, CartItemModel } from "../models";


const categoryDA = new DataAccess(CategoryModel);
const userDA = new DataAccess(UserModel);
const foodTruckDA = new DataAccess(FoodTruckModel);
const foodDA = new DataAccess(FoodModel);
const orderHistoryDA = new DataAccess(OrderHistoryModel);
const purchasedItemDA = new DataAccess(PurchasedItemModel);
const orderDA = new DataAccess(OrderModel);
const cartItemDA = new DataAccess(CartItemModel);


export {
    categoryDA,
    userDA,
    foodTruckDA,
    foodDA,
    orderHistoryDA,
    purchasedItemDA,
    orderDA,
    cartItemDA,
};


