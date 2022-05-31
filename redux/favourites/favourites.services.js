import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import {ENDPOINTS} from "../../components/config";
import handleNotify from "../../components/helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../components/helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../components/helpers/toaster/toaster-types";

  let responseclass ={
    result:{},
    status:"",
    message:""
  }
  
  export class FavouritesServices {    
    static async getFavouritesList(restaurantId, customerId,locationId) {      
      const favourites = ENDPOINTS.GET_ALL_FAVORITES;
      const data = {
        restaurantId: restaurantId,
        customerId: customerId,
        locationId: locationId,
    };
      const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }    
    };
    try {
      let response = await axios.post(favourites,data,config);
      responseclass = await JSON.parse(response.data.d);
    
    if(responseclass.result != null && responseclass.status === 1){  
      return responseclass.result;
    }
    else{
      return [];
      }
    } 
    catch (e) {
      return e;
    }
    }

    static async deletefavorite(customerId, restaurantId, menuItemId) {
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
        return e;
      }
    }
  
}
