import axios from "axios";
import { ENDPOINTS } from "../../components/config";
import { getAuthKey } from "../../components/Common/auth";

let responseclass = {
  result: {},
  status: "",
  message: "",
};

export class TestimonialServices {
  static async getTestimonialList(restaurantId) {      
    
    const testimonial = ENDPOINTS.GET_TESTIMONIALS;
    const data = {
      restaurantId: restaurantId,
    };

    const config = {
    headers: {
      'content-type': 'application/json',
      'Authorization': getAuthKey(restaurantId)
    }    
  };
  try {
    let response = await axios.post(testimonial,data,config);
    responseclass = await JSON.parse(response.data.d);
  
  if(responseclass.result != null && responseclass.status === 1){  
    return responseclass.result;
  }
  else{
    return responseclass;
    }
  } 
  catch (e) {
    return e;
  }
  }

  static async addTestimonial(name, email,phone, comment, restaurantId,customerId,locationId) {
    
    const addtestimonial = ENDPOINTS.ADD_TESTIMONIALS;
    const data = {
      TestimonialInfo: {
        name: name,
        email: email,
        phone:phone,
        comment:comment,
        customerId:customerId,
        rate:"",
        creationdate:"",
        reviewId:0,
        locationId:locationId,
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
      let response = await axios.post(addtestimonial, data, config);
      
      responseclass = await JSON.parse(response.data.d);
      
      if (responseclass.result != null && responseclass.status === 1) {
        return responseclass.result;
      } else {
        return responseclass;
      }
    } catch (e) {
      return e;
    }
  }
}
