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