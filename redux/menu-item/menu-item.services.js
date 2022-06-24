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

export class MenuItemServices {
  static async getMenuItemList(restaurantId, locationId, customerId, menuitemId,cartsessionId,cartId) {
    const methodName= "getMenuItemList";
    const location = ENDPOINTS.GET_MENU_ITEMS_DETAILS;
    const data = {
      itemDetail: {
        restaurantId: restaurantId != undefined ? restaurantId : 0,
        locationId: locationId != undefined ? locationId : 0,
        customerId: customerId != undefined ? customerId : 0,
        menuitemId: menuitemId != undefined ? parseInt(menuitemId) : 0,
        cartsessionId: cartsessionId != undefined ? cartsessionId : "",
        cartId: cartId != undefined && cartId != 0 ? parseInt(cartId) : 0
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
        return;
      })
      return e;
    }
  }

static async addfavorite(customerId, restaurantId, menuItemId) {
 const methodName="addfavorite";
    const location = ENDPOINTS.ADD_FAVORITE;
    const data = {
      customerId: customerId.toString(),
      restaurantId: parseInt(restaurantId),
      menuItemId: menuItemId.toString()
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
        handleNotify('Item is add into your favorite list', ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        handleNotify('Item is add into your favorite list', ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      errorLog(e,data,methodName,location).then(res=>{
        console.log(res)
      })
      handleNotify('Error with favorite list', ToasterPositions.TopRight, ToasterTypes.Error);
      return e;
    }
  }


  static async deletefavorite(customerId, restaurantId, menuItemId) {
    const methodName="deletefavorite";
    const location = ENDPOINTS.DELETE_FAVORITE;
    const data = {
      customerId: parseInt(customerId),
      restaurantId: parseInt(restaurantId),
      menuitemId: parseInt(menuItemId)
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
        handleNotify('Item is remove from your favorite list', ToasterPositions.TopRight, ToasterTypes.Warning);
        return responseclass.result;
      }
      else {
        handleNotify('Item is remove from your favorite list', ToasterPositions.TopRight, ToasterTypes.Warning);
        return [];
      }
    }
    catch (e) {
      handleNotify('Error with favorite list', ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }


  static async addItemToCart(orderobj, restaurantId) {  
    const methodName= "addItemToCart"; 
    const location = ENDPOINTS.ADD_ITEM_TO_CART;
    const data = {
      cartInfo : orderobj
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
        handleNotify('Item added succesfully', ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        handleNotify('Item added succesfully', ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify('Error with added item', ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }

  static async updateCartOrdersItem(orderobj, restaurantId) {  
    const methodName= "updateCartOrdersItem";
    const location = ENDPOINTS.UPDATE_CART_ORDER_ITEMS;
    const data = {
      cartInfo : orderobj
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
        handleNotify('Item updated succesfully', ToasterPositions.TopRight, ToasterTypes.Success);
        return responseclass.result;
      }
      else {
        handleNotify('Item added succesfully', ToasterPositions.TopRight, ToasterTypes.Success);
        return [];
      }
    }
    catch (e) {
      handleNotify('Error with added item', ToasterPositions.TopRight, ToasterTypes.Error);
      errorLog(e,data,methodName,location).then(res=>{
        return;
      })
      return e;
    }
  }
}

