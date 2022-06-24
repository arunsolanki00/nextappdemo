import axios from "axios"
import {getAuthKey} from "../../Common/auth"
import { getLocationIdFromStorage, getRestaurantIdFromStorage, getRestaurantNameFromStorage } from "../../Common/localstore"
import {
    ENDPOINTS
} from "../../config"
import { ConvetObjectIntoString } from "../utility"

let responseclass = {
    result: {},
    status: "",
    message: ""
}
    
export const errorLog = async (e,requestParamObj,methodName,errorFrom) => {
    let requestParam=ConvetObjectIntoString(requestParamObj);
    let errorMessage=e.response.data.Message;
    let errorCode=e.response.status;
    let errorTitle=e.response.statusText;
    let restaurantName=getRestaurantNameFromStorage();
    const location = ENDPOINTS.ERROR_LOG;
    const data = {
        errorlogRequest:{
            locationId: getLocationIdFromStorage(),
            restaurantId: getRestaurantIdFromStorage(),
            restaurantName: restaurantName,
            pageName: "",
            methodName: methodName,
            errorTitle: errorTitle,
            errorCode: errorCode,
            errorMessage: errorMessage,
            errorFrom: errorFrom,
            requestParam: requestParam

        }
    }
    let restaurantId=getRestaurantIdFromStorage()
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
        } else {
            return "";
        }
    } catch (e) {
        return e;
    }

}
// }