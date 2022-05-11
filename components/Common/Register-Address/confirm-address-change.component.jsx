import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getAddress } from "../../../redux/delivery-address/delivery-address.action";
import SaveAddressPopup from "./save-address.component";

const ConfirmAddressChange = () => {
    const dispatch = useDispatch();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const [saveaddresspopup, setsaveaddresspopup] = useState(false);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    const handlechangePopup = () => {
        dispatch(getAddress(customerId, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
        setsaveaddresspopup(true);
    }

    return (
        <>
            <div id="myModalchangeaddress" className="modal address fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <button type="button" className="close" data-dismiss="modal">
                                    <img src="/images/close.svg" alt="" /></button>
                                <h3>Change address</h3>
                            </div>
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                                <form className="customForm">
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                                        <p>Are you sure you want to change Address?<br /> This may affect your item in cart. You might need to add items again.</p>
                                    </div>
                                    <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">
                                        <a
                                            className="light_orange_btn margin_bottom_20 margin_right_10"
                                            data-dismiss="modal"
                                            data-toggle="modal"
                                            data-target="#mysaveModal"
                                            onClick={handlechangePopup}
                                        >Confirm</a>
                                        <a className="light_orange_btn margin_bottom_20 margin_left_10" data-dismiss="modal">Cancel</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {saveaddresspopup === true && <SaveAddressPopup />}
        </>
    )
}

export default ConfirmAddressChange;