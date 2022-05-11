import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";
import handleNotify from "../../components/helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../components/helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../components/helpers/toaster/toaster-types";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class CustomerServices {
  static async getCustomerPassword(restaurantId, locationId, customerId) {
    
    const passwordurl = ENDPOINTS.GET_CUSTOMER_PASSWORD;
    const data = {
      passwordDetail: {
        restaurantId: restaurantId,
        locationId: locationId,
        customerId: customerId,
      },
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };
    try {
      let response = await axios.post(passwordurl, data, config);
      responseclass = await JSON.parse(response.data.d);
      
      if (responseclass.result != null && responseclass.status === 1) {
        
        return responseclass.result;
      } else {
        //handleNotify('error with delete item', ToasterPositions.BottomRight, ToasterTypes.Error);
        return [];
      }
    } catch (e) {
      return e;
    }
  }

  static async updateCustomerInfo(userInfo) {
    
    const userInfoUrl = ENDPOINTS.UPDATE_CUSTOMER;
    const data = {
      customerreg: {
        customerId: userInfo.customerId,
        firstName: userInfo.firstname,
        lastName: userInfo.lastname,
        phone: userInfo.phone,
        emailId: userInfo.email,
        pass: userInfo.pass,
        locationId: userInfo.locationId,
        restaurantId: userInfo.restaurantId,
        picture:userInfo.picture,
        imgname:userInfo.imgname,
        imgtype:userInfo.imgtype,
        deviceToken:"",
        appVersion:"",
        deviceName:"",
        deviceModel:"",
        deviceType:"",
        loyaltynumber:"",
        SocialMediaFlag:0,
        SocialMediaId:"",
        isRegisteredThroungPos:false,
        isWeb:true,
        Address: {
          customerId: userInfo.customerId,
          othercustomerId:0,
          deliveryaddressId:0,

          address1: "",
          address2: "",
          landmark: "",
          city: "",
          
          zipcode: "",
          contactno:"",
          contactname:"",
          
          latitude:0,
          longitude:0,
          state: "",
          country: "",

          addressType: "",
        },
      }      
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(userInfo.restaurantId),
      },
    };
    try {
      let response = await axios.post(userInfoUrl, data, config);
      
      responseclass = await JSON.parse(response.data.d);
      
      if (responseclass.result != null && responseclass.status === 1) {
        handleNotify('customer updated successfully!', ToasterPositions.BottomRight, ToasterTypes.Success);
        return responseclass.result;
      } else {
        handleNotify('customer update failed!', ToasterPositions.BottomRight, ToasterTypes.Error);
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }
}
