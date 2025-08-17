import PurchasedItemsService from "./purchasedItems.service";
import FoodTruckService from "./foodTruck.service";
import MenuService from "./menu.service";
import UserService from "./user.service";
import OrderService from "./order.service";
import PaymentService from "./payment.servie";
import CartItemService from "./cartItem.service.ts";
import CartService from "./cart.service";
import CouponService from "./coupon.service";
import DiscountService from "./discount.service";
import PurchaseHistoryService from "./purchaseHistory.service";
import OrderHisotryService from "./orderHistory.service";
import ChattingService from "./chatting.service";
import AddOnsService from "./addOn.service";


const menuService = new MenuService();
const foodTruckService = new FoodTruckService();
const purchasedItemsService = new PurchasedItemsService();
const userService = new UserService();
const orderService = new OrderService();
const paymentService = new PaymentService();
const cartItemService = new CartItemService();
const cartService = new CartService();
const couponService = new  CouponService();
const discountService = new DiscountService();
const purchaseHistoryService = new PurchaseHistoryService();
const orderHistoryService = new OrderHisotryService();
const chattingService = new ChattingService();
const addOnsService = new AddOnsService();


export { 
    menuService,
    foodTruckService,
    purchasedItemsService,
    userService,
    orderService,
    paymentService,
    cartItemService,
    cartService,
    couponService,
    discountService,
    purchaseHistoryService,
    orderHistoryService,
    chattingService,
    addOnsService,
};