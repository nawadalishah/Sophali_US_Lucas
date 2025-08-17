import { UserType } from "../../@types";
import { userDA } from "../data-access";
import { v4 as uuidv4 } from 'uuid';

class UserService {

    async signup(profileData: any) {
        try {
            const data = await userDA.findOne({ email: profileData.email });
            if (data) {
                throw new Error("User with this name already exists");
            } else { 
                const id = uuidv4();
                const userData = { id, first_name: "lucas", last_name: "samuel" };
            
                const user = await userDA.create(userData);
                return user;
            }
        } catch (error: any) {
            console.error('Error in signup:', error);
            throw error;
        }
    }
    async signin(profileData: any, usertype: UserType) {
        const id = uuidv4();
        const data = await userDA.findOne({ email: profileData.email });
        if (data) {
            // if (data.password !== password) {
            //     throw new Error("Wrong Password.")
            // } else {
            //     return data;
            // }
        } else {
            throw new Error("The account doesn't exist, Register");
        }
    }
    
}

export default UserService;