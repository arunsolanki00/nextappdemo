
//import { useSelector, shallowEqual } from 'react-redux';
import { OrderModel, OrderDetails, CartDetail, OrderSummary, CustomerDetails, TipDetails, POSOrderDetails, DeliveryAddress, OrderTime, OfferDetails, OrderItems,OfferItem } from '../models/order'
import { IRegister } from '../models/testInterface'
import { OrderServices } from '../../redux/order/order.services'
import { getSessionKey } from './auth';
// import { DeliveryAddress } from '../models/customer';

// interface IOrderModel extends OrderModel {
// }



export default function placeOrderBinding(){
     
    const restaurantinfo = null; //= useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const userinfo = null;// = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    let sId = getSessionKey(restaurantinfo.restaurantId, restaurantinfo.defaultLocationId).toString();

     

    const posorderdetails: POSOrderDetails = {
        isPOSOrder: false,
    }
    const deliveryAddress: DeliveryAddress = {
        address1: "",
        deliveryaddressId: 11968,
        address2: "",
        addresstype: 0,
        othercustomerId: 0,
        city: "",
        country: "",
        customerId: userinfo.customerId,
        landmark: "",
        latitude: 0,
        longitude: 0,
        state: "",
        zipcode: "",
        businessname: "",
        contactname: "",
        contactno: ""
    }

    const customerdetails: CustomerDetails = {
        contactname: userinfo.firstname,
        contactno: userinfo.phone,
        customerId: userinfo.customerId,
        othercustomerId: 0,
        deliveryAddress: deliveryAddress
    }
    const orderdetails: OrderDetails = {
        contactDatetime: "",
        contacttime: "10:00",
        deliveryOption: "",
        isNextDayOrder: 0,
        isOrderAsap: true,
        note: "test",
        orderCode: "",
        orderId: 0,
        orderNo: "",
        orderdate: "",
        orderstatus: "1",
        ordertime: OrderTime.Asap,
        ordertype: "1",
        tableNo: "1"
    }
    const cartdetail: CartDetail = {
        restaurantId: restaurantinfo.restaurantId,
        locationId: restaurantinfo.defaultlocationId,
        //CustomeOfferMenuItem : null
    }
    const tipdetails: TipDetails = {
        driverTip: 0,
        gratuityTip: 0,
        gratuityPercent: 0,
        tip1POS: 0,
        tip2POS: 0
    }
    const ordersummary: OrderSummary = {
        additionaltax: 1,
        billamount: "10.00",
        billno: "1001",
        cardCharge: 0,
        currencycode: "",
        currencysymbol: "",
        deliveryCharges: 10,
        discount: "5",
        discountAmt: 10,
        discountPer: 10,
        redeempoints: 5,
        systemAccessFee: 5,
        totalamount: "10"
    }
    const offerdetails: OfferDetails = {
        hasOffer:false,
        offerItems:null,
        specialOfferDescription:"",
        specialOfferId:0,
        specialOfferTitle:""
    }
    const orderedItems: OrderItems = {
        parentCatId:0,
        OrderItemType:"",
        OptionList:null,
        POSOptionList:null,
        ToppingsList:null,
        cardCharge:0,
        catId:0,
        deliveryCharges:0,
        description:"",
        discount:"",
        imageurl:"",
        isOffer:0,
        isactive:true,
        isanychange:true,
        isavailable:true,
        itemname:"test",
        locationId:restaurantinfo.defaultlocationId,
        orderitemId:1110,
        price:null,
        qty:5,
        redeempoints:0,
        rewardpoints:0,
        subtotal:10,
        thumbimgurl:"",
        totaldislikes:"0",
        totallikes:"0",
        totalprice:1
    }
    
    const order: OrderModel = {
        restaurantId: restaurantinfo.restaurantId,
        locationId: restaurantinfo.defaultlocationId,
        locationName: restaurantinfo.defaultLocation.locationName,
        loyaltynumber: 0,
        sessionId: sId,
        cartdetail: cartdetail,
        customerDetails: customerdetails,
        orderDetails: orderdetails,
        orderSummary: ordersummary,
        posOrderDetails: posorderdetails,
        tipDetails: tipdetails,
        offerDetails:offerdetails,
        orderedItems:orderedItems,
    };

    OrderServices.placeOrder(order, restaurantinfo.restaurantId).then(response => {
        console.log("success call");
        }
    )
}


// export default placeOrderBinding
