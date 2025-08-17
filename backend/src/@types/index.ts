
export enum Gender {
    Male = "male",
    Female = "female"
  }
  
export enum UserType {
    ADMIN = 1, 
    MERCHANT = 2,
    ENDUSER = 3,
    DRIVER = 4
  }

export enum Country {
    US = 1,
    CANADA = 2
}

export enum Tag {
    HALAL,
    KOSHER,
    VEGEN,
}

export enum CartItemType {
    EATNOW,
    EATLATER,
    ALREADYPAID
}

export enum OrderStatus {
    REQUEST,
    ACCEPT,
    REJECT,
    READY,
    END
}

export interface AddOn {
  element: string;
  price: number;
}

export interface Size {
  size: string;
  price: number;
}

export interface RuleInterface {
  name: string;
  value: string;
}