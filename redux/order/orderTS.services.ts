import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";
import { OrderModel } from "../../components/models/order";
// import { IRegister } from "../../components/models/testInterface";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class OrderServicesTS {

  // static async getOrderTime(restaurantId, locationId, recievingTime, recieving, flg) {
  //   const location = ENDPOINTS.GET_ORDER_TIME;
  //   const data = {
  //     restaurantId: restaurantId,
  //     locationId: locationId,
  //     recievingTime: recievingTime,
  //     recieving: recieving,
  //     flg: flg,
  //   };

  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: getAuthKey(restaurantId),
  //     },
  //   };

  //   try {
  //     let response = await axios.post(location, data, config);
  //     responseclass = await JSON.parse(response.data.d);
  //      
  //     if (responseclass.result != null && responseclass.status === "1") {
  //       return responseclass.result;
  //     } else {
  //       return responseclass;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // static async getOrderInfo(restaurantId, locationId, orderId, customerId) {
  //   const orderInfo = ENDPOINTS.GET_ORDER_INFO;
  //   const data = {
  //     orderDetailRequest: {
  //       restaurantId: restaurantId,
  //       locationId: locationId,
  //       orderId: orderId,
  //       customerId: customerId,
  //     }
  //   };

  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: getAuthKey(restaurantId),
  //     },
  //   };

  //   try {
  //     let response = await axios.post(orderInfo, data, config);
  //     responseclass = await JSON.parse(response.data.d);

  //     if (responseclass.result != null && responseclass.status === "1") {
  //       return responseclass.result;
  //     } else {
  //       return responseclass;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // static async repeatOrder(restaurantId, locationId, orderId, orderDetailId, isFullOrder, customerId) {
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

  //     if (responseclass.result != null && responseclass.status === "1") {
  //       return responseclass.result;
  //     } else {
  //       return responseclass;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // static async placeOrder(order,restaurantId) {
  //    
  //   const orderPlace = ENDPOINTS.PLACE_ORDER;
  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: getAuthKey(restaurantId),
  //     },
  //   };

  //   try {
  //     let response = await axios.post(orderPlace, order, config);
  //     responseclass = await JSON.parse(response.data.d);

  //     if (responseclass.result != null && responseclass.status === "1") {
  //       return responseclass.result;
  //     } else {
  //       return responseclass;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }


  // static async getOrderTime(restaurantId, locationId, ordertype) {
  //   const checktimeurl = ENDPOINTS.GET_ORDER_TIME;
  //   const data = {
  //     restaurantId: restaurantId,
  //     locationId: locationId,
  //     ordertype: ordertype
  //   };

  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: getAuthKey(restaurantId),
  //     },
  //   };

  //   try {
       
  //     let response = await axios.post(checktimeurl, data, config);
  //     responseclass = await JSON.parse(response.data.d);

  //     if (responseclass.result != null && responseclass.status === "1") {
  //       return responseclass.result;
  //     } else {
  //       return responseclass;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }

// static async getOrderTime(restaurantId, locationId, ordertype) {
//     const location = ENDPOINTS.GET_ORDER_TIME;
//     const data = {
//       restaurantId: restaurantId,
//       locationId: locationId,
//       ordertype: ordertype
//     };

//     const config = {
//       headers: {
//         "content-type": "application/json",
//         Authorization: getAuthKey(restaurantId),
//       },
//     };

//     try {
//       let response = await axios.post(location, data, config);
//       responseclass = await JSON.parse(response.data.d);
//        
//       if (responseclass.result != null && responseclass.status === "1") {
//         return responseclass.result;
//       } else {
//         return responseclass;
//       }
//     } catch (e) {
//       return e;
//     }
//   }
  
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