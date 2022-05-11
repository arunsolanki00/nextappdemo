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

export class MyOrderServices {
  static async getOrderHistory(customerId, locationId, restaurantId) {
      
    const orders = ENDPOINTS.GET_ORDER_HISTORY;
    const data = {
      historyRequest: {
        restaurantId: restaurantId,
        customerId: customerId,
        locationId: locationId,
      },
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(orders, data, config);
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
}
