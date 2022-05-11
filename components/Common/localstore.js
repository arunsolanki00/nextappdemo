export const setLocationIdInStorage = (defaultlocationId) => {
    localStorage.setItem('defaultlocationId', defaultlocationId > 0 ? defaultlocationId : 0);
}
export const setRestaurantIdInStorage = (restaurantId) => {
    localStorage.setItem('restaurantId', restaurantId > 0 ? restaurantId : 0);
}


export const getLocationIdFromStorage =() =>{
   let locationId = localStorage.getItem('defaultlocationId');
   return locationId !== null ? parseInt(locationId) : 0
}

export const getRestaurantIdFromStorage =() =>{
    let restaurantId = localStorage.getItem('restaurantId');
    return restaurantId !== null ? parseInt(restaurantId) : 0
}
