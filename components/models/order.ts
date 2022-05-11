export interface OrderModel {
    locationId: number;
    locationName: string;
    restaurantId: number;
    loyaltynumber: number;
    sessionId: string;
    orderDetails: OrderDetails;
    cartdetail: CartDetail;
    orderSummary: OrderSummary;
    customerDetails: CustomerDetails;
    tipDetails: TipDetails;
    posOrderDetails: POSOrderDetails;
    offerDetails:OfferDetails;
    orderedItems:OrderItems;
}


export interface OrderDetails {
    orderId: number;
    orderNo: string;
    isOrderAsap: boolean;
    isNextDayOrder: number;
    deliveryOption: string;
    contactDatetime: string;
    orderCode: string;
    tableNo: string;
    contacttime: string;
    note: string;
    orderstatus: string;
    orderdate: string;
    ordertype: string;
    ordertime: OrderTime | null;
}

export interface OrderSummary {
    discount: string;
    deliveryCharges: number;
    additionaltax: number;
    cardCharge: number;

    discountPer: number;
    discountAmt: number;
    systemAccessFee: number;

    redeempoints: number;
    currencysymbol: string;
    currencycode: string;

    totalamount: string;
    billamount: string;
    billno: string;
}
export interface CustomerDetails {
    customerId: number;
    othercustomerId: number;
    contactno: string;
    contactname: string;
    deliveryAddress: DeliveryAddress;
}
export interface TipDetails {
    driverTip: number;
    gratuityTip: number;
    gratuityPercent: number;
    tip1POS: number;
    tip2POS: number;
}

export interface POSOrderDetails {
    isPOSOrder: boolean;

    othercustomerId?: number;
    posorderreferencenumber?: string;
    customerNamePOS?: string;
    serverNamePOS?: string;
    serverId?: number;
    kitchenComments?: string;
}
export interface CartDetail {
    restaurantId: string;
    locationId: string;
    }
	
    export interface CustomeOfferMenuItemList {
    menuitemId: number;
    subparameterid: number;
    qty: number;
    }


    export enum PaymentType { 
    Cash=1,
    CreditCard = 2
    }

    export interface OfferItem {
    offerId: number;
    offertitle: string;
    description: string;
    redeempoint: number;
    qty: number;
    isactive: boolean;
}
    export enum OrderTime {
    Asap = 1,
    PickaTime = 2
}
    export interface PriceType {
    menuitemid: number;
    typeid: number;
    locationId: number;
    type: string;
    pizzaside: string;
    toppingCount: number;
    price: number;
    istoppings: number;
    isMultiselect: boolean;
    isSelectAll: boolean;//added by Rameez 27.10.2014
    labelText: string;
    parameterId: number;
    selectallmsg: string;
    customeOfferDiscount: number;
    showIn: number;
    sortorder: number;
    flag: string;
    isCompulsory: boolean;
    showinblock: boolean;
    thumbimgurl: string;
    maxselection: number;
    subparsortorder: number;
    sizepid: number;
    OptionList: OptionParameters[];
    isonlineavailable: boolean;
    isposavailable: boolean;
    isdeliveryavailable: boolean;
    istakeoutavailable: boolean;
    
    linespacerequired: boolean;
    printoptiontitle: boolean;
    kitchenstationId: number;
    dynamicTimeSetting: boolean;
    
    //option
    POSOptionList: POSOptionParametersPost[];
    }

    export interface POSOptionParametersPost {
    posoptionparamsId: number;
    optionname: string;
    linespacerequired: boolean;
    printoptiontitle: boolean;
    isCustomSubOptionRequired: boolean;
    customText: string;
    POSOptionSubParametersList: POSOptionSubParametersPost[];
    //POSOptionSubParametersList: any[];
    }
    export interface POSOptionSubParametersPost {
    posoptionsubparamsId: number;
    posoptionparamsId: number;
    suboptionname: string;
    }

    export interface DeliveryAddress {
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
    businessname: string;
    }

    export enum  AddressType {
    Personal = 0,
    Business=1
    }

    export interface OptionParameters {
    menuitemid: number;
    typeid: number;
    locationId: number;
    type: string;
    price: number;
    istoppings: number;
    isMultiselect: boolean;
    isSelectAll: boolean;
    labelText: string;
    parameterId: number;
    selectallmsg: string;
    customeOfferDiscount: number;
    showIn: number;
    sortorder: number;
    flag: string;
    isCompulsory: boolean;
    showinblock: boolean;
    thumbimgurl: string;
    maxselection: number;
    subparsortorder: number;
    sizepid: number;
        ishalfpizza: boolean;
    
        halfpizzaprice: number;
    
    toppingvalue: number;
    toppingquantity: number;
    isonlineavailable: boolean;
    isposavailable: boolean;
    isdeliveryavailable: boolean;
    istakeoutavailable: boolean;
    linespacerequired: boolean;
        printoptiontitle: boolean;
    
    suboptionimgthumb: string;
    suboptionimg: string;
    calorie: number;
    suboptioncategory: string;
}
    export interface AppDetails {
    appVersion: string;
    ownerphone: string;
    apnToken: string;
    appName: string;
    appFor: string;
}
    export interface OfferDetails {
    hasOffer: boolean;
    specialOfferId: number;
    specialOfferTitle: string;
    specialOfferDescription: string;
    offerItems: OfferItem[];
}
    export interface POSPrinterSetting {
    EnableKitchenstation: boolean;
    PrinterEnable: boolean;
    PrinterId: string;
    PrinterKey: string;
}
    export interface PaymentDetails {
    amount_tendered: number;
    amount_returned: number;
    ispaid: boolean;
    paymentType: PaymentType;
    ispaypal: boolean;
    paymentmode: number;
}
    export interface OrderItems {
    parentCatId: number;
    OrderItemType: string;
    orderitemId: number;
    itemname: string;
    imageurl: string;
    thumbimgurl: string;
    description: string;
    //ratings: string;
    //noofcomments: string;
    totallikes: string;
    totaldislikes: string;
    qty: number;
    price: PriceType;
    ToppingsList: PriceType[];
    OptionList: PriceType[];
    POSOptionList: POSOptionParametersPost[];
    subtotal: number;
    totalprice: number;
    isactive: boolean;
    isanychange: boolean;
    isOffer: number;
    rewardpoints: number;
    discount: string;
    redeempoints: number;
    //pricesubparameterId: number;
    //toppingsubparameterId: number;
    deliveryCharges: number;
    cardCharge: number;
    locationId: number;
    isavailable: boolean;
    catId: number;
}