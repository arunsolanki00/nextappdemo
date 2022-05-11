import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAddress } from "../../../redux/delivery-address/delivery-address.action";
import { DeliveryAddressServices } from "../../../redux/delivery-address/delivery-address.services";
import { DeliveryAddressTypes } from "../../../redux/delivery-address/delivery-address.types";
import SaveAddressPopup from "./save-address.component";

const DeleteAddress = ({ deliveryaddressId }) => {
    const dispatch = useDispatch();
    const [saveadresspopup, setsaveadresspopup] = useState(false);
    const handlesaveAddressPopup = () => setsaveadresspopup(true);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    const handledeleteAddressPopup = () => {

        if (deliveryaddressId != undefined) {
            DeliveryAddressServices.deleteDeliveryAddress(deliveryaddressId, restaurantinfo.restaurantId).then(response => {
                if (response) {
                    dispatch({ type: DeliveryAddressTypes.DELETE_ADDRESS, payload: response })
                }
                dispatch(getAddress(customerId, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
            })
            setsaveadresspopup(true);
        }
    }

    return (
        <>
            <div id="myModaldeleteaddress" className="modal address fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <button type="button" className="close" data-dismiss="modal"><img src="/images/close.svg" alt="" /></button>
                                <h3>Delete address</h3>
                            </div>
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                                <form className="customForm">
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                                        <p>Are you sure you want to delete Address?<br /> This may affect your item in cart. You might need to add items again.</p>
                                    </div>
                                    <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">
                                        <a
                                            className="light_orange_btn margin_bottom_20 margin_right_10"
                                            data-dismiss="modal"
                                            data-toggle="modal"
                                            data-target="#mysaveModal"
                                            onClick={() => handledeleteAddressPopup()}
                                        >Confirm
                                        </a>
                                        <a
                                            className="light_orange_btn margin_bottom_20 margin_left_10"
                                            data-dismiss="modal"
                                            data-toggle="modal"
                                            data-target="#mysaveModal"
                                            onClick={handlesaveAddressPopup}
                                        >Cancel
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {saveadresspopup === true && <SaveAddressPopup />}
        </>
    )
}

export default DeleteAddress;