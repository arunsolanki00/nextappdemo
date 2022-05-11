import { React, useEffect, useState } from "react";
import { DeliveryAddressServices } from "../../redux/delivery-address/delivery-address.services";
import BusinessAddressesComponent from "./business-addresses.component";
import PersonalAddressesComponent from "./personal-addresses.component";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { getAddress, updateAddressCheck } from '../../redux/delivery-address/delivery-address.action'
import AddAddress from "../Common/Address/add-address.component";

const MyAddressesComponent = () => {
  const dispatch = useDispatch();
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );
  const userinfo = useSelector(
    ({ userdetail }) => userdetail.loggedinuser,
    shallowEqual
  );

  //when address is updated from address poup then redirect refresh address list check
  const isAddressUpdated = useSelector(({ deliveryaddress }) => deliveryaddress.isAddressUpdated, shallowEqual);

  const restaurantId = restaurantinfo.restaurantId;
  const locationId = restaurantinfo.defaultlocationId;
  const customerId = userinfo && userinfo.customerId;

  const [personalAddresses, setPersonalAddresses] = useState([]);
  const [businessAddresses, setBusinessAddresses] = useState([]);
  const [loadComplete, setLoadComplete] = useState(false);

  const [addadresspopup, setaddadresspopup] = useState(false);
  const handleaddAddressPopup = () => {

    setaddadresspopup(true);
  }

  if (isAddressUpdated) {
    setLoadComplete(false);
    dispatch(updateAddressCheck(false));
  }

  useEffect(() => {
      DeliveryAddressServices.getDeliveryAddress(customerId, restaurantId, locationId).then(
        (response) => {

          if (response) {
            console.log("response. :" + response.AddressLists);

            if (response.AddressLists) {
              let personalAddress = response.AddressLists.filter(function (personal) {
                return personal.addresstype == 0;
              });
              console.log("personalAddress. :" + personalAddress);

              let businessAddress = response.AddressLists.filter(function (business) {
                return business.addresstype == 1;
              });

              setBusinessAddresses(businessAddress);
              setPersonalAddresses(personalAddress);
            }
          }
        }
      );
    setLoadComplete(true);
  }, [!loadComplete]);

  
  function reloadAddressList() {
    setLoadComplete(false);
  }

  if (loadComplete) {
    return (
      <>
        <div className="row" id="pickup">
          <div className="in">

            {userinfo &&
              <>
                <PersonalAddressesComponent personalAddressList={personalAddresses} restaurantinfo={restaurantinfo} reloadAddressList={reloadAddressList} userinfo={userinfo} />
                <BusinessAddressesComponent businessAddressList={businessAddresses} restaurantinfo={restaurantinfo} reloadAddressList={reloadAddressList} userinfo={userinfo} />
              </>
            }


            <div className="col-lg-12 text-center margin_top_40 col-sm-12 col-xs-12">
              <a className="light_orange_btn address_btn"
                data-toggle="modal"
                data-target="#myModaladdress"
                onClick={handleaddAddressPopup}>
                + Add Address
              </a>
            </div>
          </div>
        </div>
        {addadresspopup === true && <AddAddress reloadAddressList={reloadAddressList} />}
      </>
    );
  }
  else {
    return (
      <>
        Loading......
      </>)
  }
};

export default MyAddressesComponent;
