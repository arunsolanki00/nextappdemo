import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class RestaurantHoursServices {
  static async getRestaurantHourList(locationId,restaurantId) {
    const timming = ENDPOINTS.GET_LOCATION_TIMMING;
    const data = {
      locationId: locationId,
      restaurantId: restaurantId,
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };
    try {
        
      let response = await axios.post(timming, data, config);
      responseclass = await JSON.parse(response.data.d);
      console.log('responseclass.result'+responseclass.result);
      if (responseclass.result != null && responseclass.status === 1) {
        
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (err) {
      // Handle Error Here
      return null;
    }
  }

  static async getRestaurantTodayTimming(restaurantId,locationId) {
    const todaytimming = ENDPOINTS.GET_TODAY_RESTAURANTHOURS;
    const data = {
      locationId: locationId,
      restaurantId: restaurantId,
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };
    try {
        
      let response = await axios.post(todaytimming, data, config);
      responseclass = await JSON.parse(response.data.d);
      console.log('responseclass.result'+responseclass.result);
      if (responseclass.result != null && responseclass.status === 1) {
        
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (err) {
      return null;
    }
  }
}
