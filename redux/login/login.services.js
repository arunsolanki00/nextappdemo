import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";

import { ENDPOINTS } from "../../components/config";
import { useSelector, useDispatch, shallowEqual, connect } from "react-redux";
import { useRouter } from 'next/router'
import { LoginTypes } from "./login.types";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class LoginServices {
  
  static async getLoginUserDetails(username, password, restaurantId) {
    
    const login = ENDPOINTS.LOGIN;
    const data = {
      loginRequest: {
        username: username,
        password: password,
        restaurantId: restaurantId,
      },
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };
    try {
      let response = await axios.post(login, data, config);
      responseclass = await JSON.parse(response.data.d);

      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      } else {
        return [];
      }
    } catch (e) {
      return e;
    }
  }

  static async getCustomerDetails(restaurantId,customerId) {
    
    

    const customer = ENDPOINTS.GET_CUSTOMER_INFO;
    const data = {
        customerId: customerId,
        restaurantId: restaurantId,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };
    try {
      let response = await axios.post(customer, data, config);
      responseclass = await JSON.parse(response.data.d);
    
      if (responseclass.result != null && responseclass.status === 1) {
        // return responseclass.result;
        // dispatch({
        //   type: LoginTypes.USER_DETAIL,
        //   payload: responseclass.customerDetails,
        // });

        return responseclass.result;
      } else {
        return [];
      }
    } catch (e) {
      return e;
    }
  }
}
