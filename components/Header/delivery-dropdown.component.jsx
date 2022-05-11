import { useState } from "react";
import { useSelector } from "react-redux";
import ConfirmAddressChange from "../Common/Address/confirm-address-change.component";
import LoginMainComponent from "../login/login.component";

function DeliveryDropdownComponent() {
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    let objrestaurant = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const [deliverylocationpopup, setdeliverylocationpopup] = useState(false);
    const [loginpopup, setloginpopup] = useState(false);

    const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery);
    const selecteddeliveryaddress = selecteddelivery.selecteddeliveryaddress;

    const [addressdisplay, setaddressdisplay] = useState([]);

    const handleDeliveryLocationPopup = () => {
        if (userinfo != null && userinfo != undefined) {
            setdeliverylocationpopup(true);
            setloginpopup(false);
        }
        else if (userinfo === null || userinfo === undefined) {
            setloginpopup(true);
            setdeliverylocationpopup(false);
        }
    }

    function displayselecteddelivery() {

        let addressdisplay = '';

        if (selecteddeliveryaddress !== null && selecteddeliveryaddress !== undefined && selecteddeliveryaddress.addresstype !== undefined) {
            if (selecteddeliveryaddress.addresstype === 0) {
                addressdisplay = selecteddeliveryaddress.address1 + ',' + selecteddeliveryaddress.city;
            }
            else if (selecteddeliveryaddress.addresstype === 1) {
                addressdisplay = selecteddeliveryaddress.businessname.toString()?.length > 0
                    ?
                    selecteddeliveryaddress.businessname + ',' + selecteddeliveryaddress.city
                    : selecteddeliveryaddress.address1 + ',' + selecteddeliveryaddress.city;
            }
            else {
                addressdisplay = 'Delivery Address';
            }
        }
        else {
            addressdisplay = 'Delivery Address';
        }
        return (
            <>{addressdisplay}</>
        )
    }
    function displayselectedPickup() {
        return (
            <>{`${objrestaurant && objrestaurant.defaultLocation.address1},  ${objrestaurant && objrestaurant.defaultLocation.cityname}`}</>
        )
    }
    return (
        <>
            <div className="col-lg-9 small-text-right flush text-right dele col-sm-9 col-xs-10">
                <div className="dropdown">
                    {selecteddelivery &&
                        <>
                            <h6 className="margin_0">{selecteddelivery && selecteddelivery.pickupordelivery}</h6>

                        </>
                    }
                    {userinfo != undefined && userinfo != null &&
                        selecteddelivery && selecteddelivery.pickupordelivery.toString().toLowerCase() === 'delivery' ?
                        <>
                            <a
                                className="color_grey d-inline-block size_20"
                                onClick={handleDeliveryLocationPopup}
                                data-toggle="modal"
                                data-target="#myModalchangeaddress">
                                {displayselecteddelivery()}
                                <i className="fa size_32 color_green margin_left_5 top_-1 position_relative d-inline-block v-middle fa-angle-right"></i>
                            </a>
                        </>
                        :
                        <>
                            {/* USERINFO NULL AND PICKUPDELIVERY IS DELIVERY  DISPLAY DELIVERY */}
                            {
                                userinfo === null && selecteddelivery && selecteddelivery.pickupordelivery.toString().toLowerCase() === 'delivery' ? <></> :
                                    <a className="color_grey d-inline-block size_20">
                                        {displayselectedPickup()}
                                        <i className="fa size_32 color_green margin_left_5 top_-1 position_relative d-inline-block v-middle fa-angle-right"></i>
                                    </a>
                            }

                            {/* {`${objrestaurant && objrestaurant.defaultLocation.address1},  ${objrestaurant && objrestaurant.defaultLocation.cityname}`}  */}
                        </>
                    }
                    {(userinfo === undefined || userinfo === null) &&
                        <a
                            className="color_grey d-inline-block size_20"
                            onClick={handleDeliveryLocationPopup}
                            data-toggle="modal"
                            data-target="#myModal-logintest">
                            {selecteddelivery && selecteddelivery.pickupordelivery.toString().toLowerCase() === 'pickup' ?
                                ''
                                :
                                <>
                                    {/* TO DO */}
                                    {
                                        selecteddeliveryaddress === null ? <>
                                            Delivery Address
                                            <i className="fa size_32 color_green margin_left_5 top_-1 position_relative d-inline-block v-middle fa-angle-right"></i>
                                        </> :
                                            <>
                                                {displayselecteddelivery()}
                                                <i className="fa size_32 color_green margin_left_5 top_-1 position_relative d-inline-block v-middle fa-angle-right"></i>
                                            </>
                                    }

                                </>}
                        </a>}
                </div>
            </div>

            {loginpopup === true && <LoginMainComponent restaurantinfo={objrestaurant} />}
            {deliverylocationpopup === true && <ConfirmAddressChange />}
        </>
    )
}

export default DeliveryDropdownComponent