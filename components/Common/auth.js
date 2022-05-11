export const getAuthKey = (restaurantId) => {

    const md5File = require('md5');
    let seckey = md5File('F0Dm@_' + restaurantId);
    return seckey;
}

export const getSessionKey = (restaurantId,customerId,locationId) => {

    // const md5File = require('md5');
    // let seckey = md5File('F0Dm@_'+ restaurantId+ "_" +locationId  + '_' + customerId);
    // return seckey;
    return;
}