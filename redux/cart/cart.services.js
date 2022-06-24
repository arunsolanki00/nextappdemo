import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";
import { errorLog } from "../../components/helpers/errorlog/errorlog";
import handleNotify from "../../components/helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../components/helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../components/helpers/toaster/toaster-types";

let responseclass = {
  result: {},
  status: "",
  message: ""
}

export class CartServices {
  static async getCartItemList(cartsessionId, locationId, restaurantId, cartId, customerId, rewardpoints, redeemamount, deliveryaddressId,tipPercentage,tipAmount) {
    const methodName= "getCartItemList";
    const location = ENDPOINTS.GET_CART_ITEM;
    const data = {
      cartItem: {
        cartsessionId: cartsessionId,
        locationId: parseInt(locationId),
        restaurantId: parseInt(restaurantId),
        cartId: parseInt(cartId),
        customerId: parseInt(customerId),
        rewardpoints: rewardpoints != undefined ? parseInt(rewardpoints) : 0,
        redeemamount: redeemamount != undefined ? parseFloat(redeemamount) : 0,
        tipPercentage: tipPercentage,
        tipAmount:tipAmount,
        deliveryaddressId: deliveryaddressId != undefined && deliveryaddressId > 0 ? parseInt(deliveryaddressId) : 0
      }
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      }
      else {
        return [];
      }
    }
    catch (e) {
      errorLog(e,data,methodName,location).then(res=>{
        return res;
      })
      return e;
    }
  }

  static async getCartItemCount(cartsessionId, locationId, restaurantId, customerId) {
    const methodName= "getCartItemCount";
    const location = ENDPOINTS.GET_CART_ITEM_COUNT;
    const data = {
      cartsessionId: cartsessionId,     
      locationId: parseInt(locationId),
      restaurantId: parseInt(restaurantId),
      customerId: parseInt(customerId)
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);
      
      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      }
      else {
        return [];
      }
    }
    catch (e) {
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async deleteCartItem(cartsessionId, cartId, restaurantId, locationId) {
    const methodName= "deleteCartItem";
    const location = ENDPOINTS.DELETE_CART_ITEM;
    const data = {
      cartsessionId: cartsessionId,
      cartId: parseInt(cartId),
      restaurantId: parseInt(restaurantId),
      locationId: parseInt(locationId)
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        handleNotify('delete item successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        handleNotify('delete item successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify('error with delete item', ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async checkCustomerRewardPoints(restaurantId, customerId, rewardpoints, amount) {
    const methodName= "addItemcheckCustomerRewardPointsToCart";
    const location = ENDPOINTS.CHECK_CUSTOMER_REWARD_POINTS;
    const data = {
      restaurantId: restaurantId,
      customerId: parseInt(customerId),
      rewardpoints: parseInt(rewardpoints),
      amount: parseFloat(amount)
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);
      
      if (responseclass.result != null && responseclass.status === 1) {
        if(rewardpoints > 0){
          handleNotify(rewardpoints + " Reward Points has been redeemed", ToasterPositions.TopRight, ToasterTypes.Success);
        }
        return responseclass;
      }
      else {
        handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Warning);
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with reward point", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async updatequantity(cartsessionId, cartId, qty, price, locationId, restaurantId) {
    const methodName= "updatequantity";
    const location = ENDPOINTS.UPDATE_QUANTITY;
    const data = {
      updateCartItem: {
        cartsessionId: cartsessionId,
        cartId: parseInt(cartId),
        qty: parseInt(qty),
        price: parseFloat(price),
        locationId: parseInt(locationId),
        restaurantId: parseInt(restaurantId)
      }
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with update quantity", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async carttotal(cartsessionId, locationId, restaurantId, customerId, cartId, rewardpoints, redeemamount, tipPercentage, tipAmount, deliveryaddressId) {
    const methodName= "carttotal";
    const location = ENDPOINTS.GET_CART_TOTAL;
    const data = {
      cartItem: {
        cartsessionId: cartsessionId != undefined ? cartsessionId : 0,
        locationId: locationId != undefined ? parseInt(locationId) : 0,
        restaurantId: restaurantId != undefined ? parseInt(restaurantId) : 0,
        customerId: customerId != undefined ? parseInt(customerId) : 0,
        cartId: cartId != undefined ? parseInt(cartId) : 0,
        rewardpoints: rewardpoints != undefined ? parseInt(rewardpoints) : 0,
        redeemamount: redeemamount != undefined ? parseFloat(redeemamount) : 0,
        tipPercentage: tipPercentage != undefined && tipPercentage != "" ? parseFloat(tipPercentage) : 0,
        tipAmount: tipAmount != undefined && tipAmount != "" ? parseFloat(tipAmount) : 0,
        deliveryaddressId: deliveryaddressId != undefined && deliveryaddressId > 0 ? parseInt(deliveryaddressId) : 0
      }
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        //handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        //handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with cart total", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async deliverycharges(restaurantId, locationId,isGeoFancing) {
    const methodName= "deliverycharges";
    const location = ENDPOINTS.GET_DELIVERY_CHARGES;
    const data = {
      restaurantId: restaurantId,
      locationId: locationId,
      isGeoFancing: isGeoFancing
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

       
      if (responseclass.result != null && responseclass.status === 'success') {
        //handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        //handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with delivery charges", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async cartcheckout(itemobj, restaurantId) {
    const methodName= "cartcheckout";
    const location = ENDPOINTS.CART_CHECKOUT;
    const data = {
      obj: itemobj
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        //handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        //handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with checkout", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
		
      return e;
    }
  }

  static async getstripepaymentintentid(restaurantId, locationId, orderId, customerId, totalAmount) {
    const methodName= "getstripepaymentintentid";
    const paymentintenturl = ENDPOINTS.GET_PAYMENT_INTENT_ID;
    const data = {
      paymentIntent: {
        restaurantId: restaurantId,
        locationId: locationId,
        orderId: orderId,
        customerId: customerId,
        totalAmount: totalAmount
      }
    }
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(paymentintenturl, data, config);
      responseclass = await JSON.parse(response.data.d);

      
      console.log(responseclass);
      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      }
      else {
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with checkout", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async confirmstripepayment(restaurantId, locationId, orderId, customerId, totalAmount, paymentMethodId, paymentIntentId,
    cardname, cardnumber, cvv, expmonth, expyear, zipcode) {
      const methodName= "confirmstripepayment";
    const paymentintenturl = ENDPOINTS.CONFIRM_STRIPE_PAYMENT;
    const data = {
      paymentIntent: {
        restaurantId: restaurantId,
        locationId: locationId,
        orderId: orderId,
        customerId: customerId,
        totalAmount: totalAmount,
        paymentIntentId: paymentIntentId,
        paymentMethodId: paymentMethodId,

        cardname: cardname,
        cardnumber: cardnumber,
        cvv: cvv,
        expmonth: expmonth,
        expyear: expyear,
        zipcode: zipcode
      }
    }
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(paymentintenturl, data, config);
      responseclass = await JSON.parse(response.data.d);

      console.log(responseclass);
      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      }
      else {
        return [];
      }
    }
    catch (e) {
      handleNotify("Error with checkout", ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async deleteCartItemFromSessionId(cartsessionId, restaurantId, locationId) {
    const methodName= "deleteCartItemFromSessionId";
    const location = ENDPOINTS.DELETE_CART_FROM_SESSIONID;
    const data = {
      cartsessionId: cartsessionId,
      restaurantId: parseInt(restaurantId),
      locationId: parseInt(locationId)
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }
    };
    try {
      let response = await axios.post(location, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        // handleNotify('cart deleted successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
       // handleNotify('cart deleted successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify('error with delete item', ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }
}

