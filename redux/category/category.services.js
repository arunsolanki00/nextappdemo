import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";


import {ENDPOINTS} from "../../components/config";

  let responseclass ={
    result:{},
    status:"",
    message:""
  }
  
  export class CategoryServices {    
    static async getCategoryItemList(restaurantId,categories,customerId,locationId) {      
      const location = ENDPOINTS.GET_ALL_MENU_ITEMS;
      const data = {
        menuItemRequest:{
          restaurantId: restaurantId,
          categories: categories,
          customerId: customerId,
          locationId: locationId
        }          
      };
      const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': getAuthKey(restaurantId)
      }    
    };
    try {
      let response = await axios.post(location,data,config);
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
}
