import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";
import handleNotify from "../../components/helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../components/helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../components/helpers/toaster/toaster-types";
// import { OrderModel } from "../../components/models/order";
// import { IRegister } from "../../components/models/testInterface";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class OrderServices {

  static async checkOrderTime(restaurantId, locationId, recievingTime, recieving, flg) {
    const checktimeurl = ENDPOINTS.CHECK_ORDER_TIME;
    const data = {
      restaurantId: restaurantId,
      locationId: locationId,
      recievingTime: recievingTime,
      recieving: recieving,
      flg: flg,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(checktimeurl, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === "1") {
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

  static async getOrderInfo(restaurantId, locationId, orderId, customerId) {
    const orderInfo = ENDPOINTS.GET_ORDER_INFO;
    const data = {
      orderDetailRequest: {
        restaurantId: restaurantId,
        locationId: locationId,
        orderId: orderId,
        customerId: customerId,
      }
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(orderInfo, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === "1") {
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

  static async repeatOrder(restaurantId, locationId, orderId, orderDetailId, isFullOrder, customerId,cartsessionid) {
    // const cartsessionid = getSessionKey(restaurantId, customerId, locationId);
    const orderPlace = ENDPOINTS.REPEAT_ORDER;
    const data = {
      placeOrder: {
        restaurantId: restaurantId,
        locationId: locationId,
        orderId: orderId,
        orderDetailId: orderDetailId,
        isFullOrder: isFullOrder,
        sessionId: cartsessionid
      }
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(orderPlace, data, config);
      return responseclass = await JSON.parse(response.data.d);
      
      // if (responseclass.result != null && responseclass.status === "1") {
      //   return responseclass;
      // } else {
      //   return responseclass;
      // }
    } catch (e) {
      return e;
    }
  }

  static async placeOrder(order,restaurantId) {
     
    const orderPlace = ENDPOINTS.PLACE_ORDER;
    const data = {
      order: order
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(orderPlace,data, config);
      responseclass = await JSON.parse(response.data.d);
      Console.log("response: "+response);
      if (responseclass.result != null && responseclass.status === "1") {
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

  static async getOrderTime(restaurantId, locationId, ordertype) {
    
    const checktimeurl = ENDPOINTS.GET_ORDER_TIME;
    const data = {
      restaurantId: restaurantId,
      locationId: locationId,
      ordertype: ordertype
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(checktimeurl, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === "1") {
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

  static async addOrder(placeOrder,restaurantId) {
    const addorderurl = ENDPOINTS.ADD_ORDER;
    const data = {
      placeOrder: placeOrder
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      
      let response = await axios.post(addorderurl,data, config);
      
      responseclass = await JSON.parse(response.data.d);
      console.log(responseclass.result);

      if (responseclass.result != null && responseclass.status === "1") {
        handleNotify('Order complete successfully!', ToasterPositions.BottomRight, ToasterTypes.Success);
        

        return responseclass.result;
      } else {
        handleNotify(responseclass, ToasterPositions.BottomRight, ToasterTypes.Error);
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

   static async getAllCountry() {
    const countryurl = ENDPOINTS.COUNTRY_LIST;
    const data = {
    };

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    try {
      
      
      let response = await axios.post(countryurl, data, config);
      responseclass = await JSON.parse(response.data.d);
 
      if (responseclass.result != null && responseclass.status === "1") {
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

  static async confirmStripePayment(cardPayment) {
    const paymenturl = ENDPOINTS.CONFIRM_STRIPE_PAYMENT;

    const data = {
      cardPayment : {
        restaurantId: cardPayment.restaurantId,
        locationId: cardPayment.locationId,
        // ordertype: ordertype,
        paymentIntentId : cardPayment.paymentIntentId,
        orderId : cardPayment.orderId,
        paymentMethodId : cardPayment.paymentMethodId,
        totalAmount : cardPayment.totalAmount,
        customerId : cardPayment.customerId,
        cardname : cardPayment.cardname,
        emailId : cardPayment.emailId,
        cardnumber : cardPayment.cardnumber,
        expmonth : cardPayment.expmonth,
        expyear : cardPayment.expyear,
        cvv : cardPayment.cvv,
        zipcode : cardPayment.zipcode,
        countryId : cardPayment.countryId,
        sessionId : cardPayment.cartsessionid,
      }
    };
    
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(cardPayment.restaurantId),
      },
    };

    try {
       
      let response = await axios.post(paymenturl, data, config);
      responseclass = await JSON.parse(response.data.d);
      
      console.log(responseclass);
      //return responseclass;
      
      if (responseclass.result != null && responseclass.status === 1) {
        handleNotify(responseclass.result.message, ToasterPositions.BottomRight, ToasterTypes.Success);
        return responseclass;
      } else {
        return responseclass;
      }
    } catch (e) {
      handleNotify('Something Went wrong!', ToasterPositions.BottomRight, ToasterTypes.Error);
      return e;
    }
  }

  static async getOrderTiming(restaurantId, locationId, ordertype) {
    const checktimeurl = ENDPOINTS.GET_TIMING;
    const data = {
      request :{
      restaurantId: restaurantId,
      locationId: locationId,
      ordertype: ordertype
    }
  }
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
       
      let response = await axios.post(checktimeurl, data, config);
      responseclass = await JSON.parse(response.data.d);
 
      if (responseclass.result != null && responseclass.status === "1") {

        console.log("responseclass.result :"+responseclass.result);
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }
  // static async testFunction(props: IRegister) {
  //    
  //   console.log(props.email);
  //   let phone = props.phone;
  //   let name = props.name;
  //   let email = props.email;

  //   return null;
  // }
  // static async placeOrder(props: OrderModel) {
  //   //props.customerDetails.contactname
  //   const cartsessionid = getSessionKey(restaurantId, customerId);
  //   const orderPlace = ENDPOINTS.REPEAT_ORDER;
  //   const data = {
  //     placeOrder: {
  //       restaurantId: restaurantId,
  //       locationId: locationId,
  //       orderId: orderId,
  //       orderDetailId: orderDetailId,
  //       isFullOrder: isFullOrder,
  //       sessionId: cartsessionid
  //     }
  //   };

  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: getAuthKey(restaurantId),
  //     },
  //   };

  //   try {
  //     let response = await axios.post(orderPlace, data, config);
  //     responseclass = await JSON.parse(response.data.d);

  //     if (responseclass.result != null && responseclass.status === 1) {
  //       return responseclass.result;
  //     } else {
  //       return responseclass;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }
}