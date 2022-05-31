import axios from "axios";
import { getAuthKey } from "../../components/Common/auth";
import { ENDPOINTS } from "../../components/config";
import handleNotify from "../../components/helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../components/helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../components/helpers/toaster/toaster-types";

let responseclass = {
    result: {},
    status: "",
    message: ""
}

export class DeliveryAddressServices {    
    static async getDeliveryAddress(customerId, restaurantId, locationId) {
        
        const location = ENDPOINTS.GET_DELIVERY_ADDRESS;
        const data = {
            customerId: parseInt(customerId),
            restaurantId: parseInt(restaurantId),
            locationId: parseInt(locationId)
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
            return e;
        }
    }

    static async deleteDeliveryAddress(deliveryaddressId, restaurantId) {
        
        const location = ENDPOINTS.DELETE_DELIVERY_ADDRESS;
        const data = {
            deliveryaddressId: parseInt(deliveryaddressId),
            restaurantId: parseInt(restaurantId)
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
                handleNotify('delete item successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
                return responseclass.result;
            }
            else {
                handleNotify('delete item successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
                return [];
            }
        }
        catch (e) {
            handleNotify('error with delete item', ToasterPositions.TopRight, ToasterTypes.Error);
            return e;
        }
    }

    static async addDeliveryAddress(obj, restaurantId, locationId) {
        
        const location = ENDPOINTS.ADD_DELIVERY_ADDRESS;
        const data = {
            deliveryAddressRequest: {
                customerId: parseInt(obj.customerId),
                othercustomerId: parseInt(obj.othercustomerId),
                deliveryaddressId: parseInt(obj.deliveryaddressId),
                address1: obj.address1,
                address2: obj.address2,
                landmark: obj.landmark,
                city: obj.city,
                zipcode: obj.zipcode,
                contactno: obj.contactno,
                contactname: obj.contactname,
                latitude: parseFloat(obj.latitude),
                longitude: parseFloat(obj.longitude),
                state: obj.state,
                country: obj.country,
                addresstype: obj.addresstype,
                businessname:obj.businessname,
            },
            restaurantId: parseInt(restaurantId),
            locationId: parseInt(locationId),
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
                handleNotify('Address added successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
                return responseclass.result;
            }
            else if(responseclass.message && responseclass.status === 2){
                handleNotify(responseclass.message, ToasterPositions.TopRight, ToasterTypes.Warning);
                return null;
            }            
        }
        catch (e) {
            handleNotify('error with delete item', ToasterPositions.TopRight, ToasterTypes.Error);
            return e;
        }
    }
}