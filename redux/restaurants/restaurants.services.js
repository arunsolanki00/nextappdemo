import axios from "axios";
import { ENDPOINTS } from "../../components/config";

let responseclass = {
  result: {},
  status: "",
  message: ""
}

export class RestaurantsServices {

  static async getRestaurantsList(restauranturl, defaultLocationId) {
    const location = ENDPOINTS.GET_RESTAURANTS;
    const config = {
      headers: {
        "content-type": "application/json",
      }
    };

    const data = {
      restaurantDetailRequest: {
        restaurantURL: restauranturl,
        defaultLocationId: defaultLocationId
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
      return e;
    }
  }

  static async getRestaurantLocationList() {
    debugger
    console.log('getRestaurantLocationList')
    const restaurant = ENDPOINTS.GET_RESTAURANT_LOCATIONS_LIST;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      }

    };
    try {
      debugger
      let response = await axios.post(restaurant, config);
      console.log('response' + response)
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      } else {
        return [];
      }
    } catch (e) {
      console.log('response error' + e)
      return e;
    }
  }
}
