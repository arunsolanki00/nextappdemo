
export class CustomerInfo {
    firstName: string;
    lastName: string;
    customerId: number;
    emailId: string;
    phone: string;
    restaurantId:number;
    pass:string;
    deviceToken:string;
    appVersion:string;
    deviceName:string;
    deviceModel:string;
    deviceType:string;
    locationId:string;
    loyaltynumber:string;
    SocialMediaFlag:number;
    SocialMediaId:string;
    isRegisteredThroungPos: boolean;
    address: DeliveryAddress | null;
}

export class DeliveryAddress {
    customerId: number;
    othercustomerId: number;
    deliveryaddressId: number;
    address1: string;
    address2: string;
    landmark: string;
    city: string;
    zipcode: string;
    contactno: string;
    contactname: string;
    latitude: number;
    longitude: number;
    state: string;
    country: string;

    addresstype: AddressType | null;
}

export enum AddressType {
    Personal=0,
    Business=1
}