import axios from "axios"
import { getAuthKey } from "../../Common/auth"
import { ENDPOINTS } from "../../config"

let responseclass = {
    result: {},
    status: "",
    message: ""
  }
export class ErrorLogServices{
    static async errorLog(locationId,restaurantId,restaurantName,pageName,methodName,errorTitle,errorCode,errorMessage,errorFrom,requestParam){
     const location=ENDPOINTS.ERROR_LOG;        
     const data={
        locationId:locationId,
        restaurantId:restaurantId,
        restaurantName:restaurantName,
        pageName:pageName,
        methodName:methodName,
        errorTitle:errorTitle,
        errorCode:errorCode,
        errorMessage:errorMessage,
        errorFrom:errorFrom,
        requestParam:requestParam
     }
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
        return e;
    }

    }
}