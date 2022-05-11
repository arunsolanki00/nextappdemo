import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";

import { ENDPOINTS } from "../../components/config";

let responseclass = {
  result: {},
  status: "",
  message: "",
};


export class LocationServices {
    static async getLocationInfo(restaurantId,latitude,longitude) {
      
      const location = ENDPOINTS.GET_LOCATIONS;
      const data = {
            restaurantId:restaurantId,
            latitude:latitude,
            longitude:longitude
      };
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: getAuthKey(restaurantId),
        },
      };
      try {
        let response = await axios.post(location, data, config);
        responseclass = await JSON.parse(response.data.d);
  
        if (responseclass.result != null && responseclass.status === 1) {
          return responseclass.result;
        } else {
          return responseclass;
        }
      } catch (e) {
        return e;
      }
    }

    static async getAllLocationList(restaurantId) {
      
      const location = ENDPOINTS.GET_ALL_LOCATION_List;
      const data = {
            restaurantId:restaurantId,
      };
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: getAuthKey(restaurantId),
        },
      };
      try {
        let response = await axios.post(location, data, config);
        responseclass = await JSON.parse(response.data.d);
  
        if (responseclass.result != null && responseclass.status === 1) {
          return responseclass.result;
        } else {
          return responseclass;
        }
      } catch (e) {
        return e;
      }
    }
  }
  