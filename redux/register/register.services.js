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

export class RegisterServices {

  static async registerUser(registerModel, address, locationId, restaurantId) {

    const registerurl = ENDPOINTS.REGISTER;
    const data = {
      "register": {
        "user": {
          "firstname": registerModel.firstname,
          "lastname": registerModel.lastname,
          "phone": registerModel.phone,
          "email": registerModel.email,
          "password": registerModel.password,
          "countrycode":registerModel.countrycode,
          "isVerifiedPhone":registerModel.isVerifiedPhone,
        },
        "address": {
          "address1": address.address1,
          "address2": address.address2,
          "address3": address.landmark,
          "city": address.city,
          "state": address.state,
          "country": address.country,
          "zipcode": address.zipcode,
          "addressType": address.addresstype,
          "businessname":address.businessname,
        },
        "locationId": locationId,
        "restaurantId": restaurantId,
      },
    };
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: getAuthKey(restaurantId),
      },
    };
    try {
      var jsonstring = JSON.stringify(data);
      let response = await axios.post(registerurl, jsonstring, config);

      responseclass = await JSON.parse(response.data.d);
      console.log(responseclass)
      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }

  static async getOTPVerificationSetting(restaurantId, enableotpauthentication, smsapigateway) {
    const location = ENDPOINTS.OTP_VERIFICATION_SETTING;
    const data = {
      restaurantId: parseInt(restaurantId),
      enableotpauthentication: enableotpauthentication,
      smsapigateway: parseInt(smsapigateway)
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
      handleNotify('Error', ToasterPositions.TopRight, ToasterTypes.Error);
      return e;
    }
  }

  static async twilioSendCode(restaurantId, enableotpauthentication, smsapigateway, mobilenumber) {
    const location = ENDPOINTS.TWILIO_SEND_CODE;
    const data = {
      restaurantId: parseInt(restaurantId),
      enableotpauthentication: enableotpauthentication,
      smsapigateway: parseInt(smsapigateway),
      mobilenumber: mobilenumber
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
      handleNotify('Error', ToasterPositions.TopRight, ToasterTypes.Error);
      return e;
    }
  }

  static async twilioVerifyCode(restaurantId, enableotpauthentication, smsapigateway, code, mobilenumber) {
    const location = ENDPOINTS.TWILIO_VERIFY_CODE;
    const data = {
      restaurantId: parseInt(restaurantId),
      enableotpauthentication: enableotpauthentication,
      smsapigateway: parseInt(smsapigateway),
      code: code,
      mobilenumber: mobilenumber
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
      handleNotify('Error', ToasterPositions.TopRight, ToasterTypes.Error);
      return e;
    }
  }
}
