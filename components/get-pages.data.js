import { ENDPOINTS } from "./_config.js";

export async function getPageDataByApiUrl(apiUrl) {
    let response;
  
    try {
      const request = await fetch(`${ENDPOINTS.BASE_URL}${apiUrl}`);
      response = await request.json();
    } catch (e) {
      console.log("error getting page data", e);
      return null;
    }
  
    return response;
}