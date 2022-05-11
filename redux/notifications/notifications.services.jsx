import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class NotificationsServices {
  static async getNotifications(restaurantId, customerId) {

    const notification = ENDPOINTS.GET_ALL_NOTIFICATION_List;
    const data = {
      restaurantId: restaurantId,
      customerId: customerId,
      lastId: 0,
      pagesize: 50,
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };

    try {
      let response = await axios.post(notification, data, config);
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
