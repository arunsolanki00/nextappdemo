import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loader from "../Common/loader/loader.component";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ENDPOINTS } from "../config";
import { restaurantsdetail } from "../../redux/restaurants/restaurants.action";
import { deleteCartItemFromSessionId, emptycart, initialrewardpoint } from "../../redux/cart/cart.action";
import { getLocationIdFromStorage, setLocationIdInStorage } from "./localstore";
import { getAuthKey } from "./auth";
import { clearRedux } from "../../redux/clearredux/clearredux.action";
import { createSessionId } from "../../redux/session/session.action";
import { v4 as uuidv4 } from 'uuid';

const RestaurantLocationsComponent = (props) => {
  const [hidelocations, sethidelocations] = useState(false);
  const restaurantlocation = useSelector(({ restaurant }) => restaurant.restaurantslocationlist);
  const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
  const [addressList, setAddressList] = useState(restaurantlocation?.addressList);
  const defaultLocation = restaurantinfo?.defaultLocation;
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query: { dynamic, location, id, category, items } } = router;
  let sessionid = useSelector(({ session }) => session?.sessionid);
  const handleClick = async (lid) => {

    const request = await fetch(ENDPOINTS.LOCATION_BY_ID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': getAuthKey(restaurantinfo.restaurantId)
      },
      body: JSON.stringify({
        restaurantId: restaurantinfo.restaurantId,
        locationId: lid
      })
    });
    const response = await request.json();

    var data = await JSON.parse(response.d);

    Object.keys(restaurantinfo).map((session) => {
      if (session === 'defaultLocation') {
        Object.assign(restaurantinfo.defaultLocation, data.result);
      }
      if (session === 'defaultlocationId') {
        restaurantinfo.defaultlocationId = data.result.locationId;
      };
    });
    
    dispatch(restaurantsdetail(null));  
    dispatch(restaurantsdetail(restaurantinfo));
    //   CLEAR THE REDUX IF PREVIOUS LOCATION AND THE CURRENT SELECTED LOCATION IS NO SAME
    let oldLocationId = getLocationIdFromStorage();
    if (oldLocationId !== restaurantinfo.defaultlocationId) { 
      dispatch(clearRedux());

      let id = uuidv4();
      dispatch(createSessionId(id));
    }

    setLocationIdInStorage(restaurantinfo.defaultlocationId);

    if (restaurantinfo.defaultLocation.locationURL !== undefined) {
      router.push(`/${dynamic}/${restaurantinfo.defaultLocation.locationURL.toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "")}`)
    }
    if (userinfo && userinfo?.customerId) {
      deleteCartItemFromSessionId(sessionid, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId);
      dispatch(emptycart());
      dispatch(initialrewardpoint(userinfo));
    }
    $('.modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    sethidelocations(true);
    props.handleLocationPopup(false);
  }
  if (addressList !== null)
    return (
      <>
        {hidelocations !== true &&
          <div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              {/* Modal content*/}
              <div className="modal-content">
                <div className="modal-body">
                  <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <button type="button" className="close" data-dismiss="modal">
                      <img src="/images/close.svg" alt="" />
                    </button>
                    <h4 style={{ fontSize: "25px" }}>
                      <img src="/images/pin.png" alt="" /> Restaurant locations
                    </h4>
                  </div>
                  <div className="col-lg-12 col-sm-12 col-xs-12">
                    {addressList && addressList.map((address, index) => {
                      let locationFullAddress = address.locationName + "," + address.address1 + "," + address.cityName + "," + address.zipcode;
                      let gmaplink = ENDPOINTS.GOOGLE_MAP_LINK + locationFullAddress;
                      return (
                        <div key={index} style={address.locationId === defaultLocation.locationId ? { backgroundColor: "lightgrey", borderRadius: "25px" } : { backgroundColor: "" }}>
                          <a value={address.locationId}
                            onClick={() => handleClick(address.locationId)}
                          >
                            <div className="row">
                              <div className="col-lg-1">
                              </div>
                              <div className="col-lg-11">
                                <h4 style={{ marginBottom: "-8px" }}>{address.locationName} </h4>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-1">
                                <a href={gmaplink} target="_blank" rel="noreferrer">
                                  <img src="/images/pinnew.png" alt="" />
                                </a>
                              </div>
                              <div className="col-lg-11 col-sm-11">
                                <h5>{`${address.address1}, ${address.cityName}, ${address.zipcode}`}</h5>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-1">
                              </div>
                              <div className="col-lg-11 offset-1">
                                {(address.isTakeaway === true && restaurantinfo.istakeaway === true) && <span className="size_20 color_black"> <> Pickup <i className="fa fa-check greenColor" aria-hidden="true"></i></>&nbsp; &nbsp; </span>}
                                {(address.isDelivery === true && restaurantinfo.isdelivery === true) && <span className="size_20 color_black"> <> Delivery <i className="fa fa-check greenColor" aria-hidden="true"></i></> </span>}
                              </div>
                            </div>
                            <hr />
                          </a>
                        </div>
                      )
                    })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </>
    );
  return <Loader />
};

export default RestaurantLocationsComponent;
