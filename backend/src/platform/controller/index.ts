

import MerchantController from "./merchant.controller";
import EndUserController from "./endUser.controller";
import AdminController from "./admin.controller";


const merchantController = new MerchantController();
const endUserController = new EndUserController();
const adminController = new AdminController();

export {
    merchantController,
    endUserController,
    adminController,
}