import React, { useState, useEffect } from "react";
import BusinessAddress from "./business-address.component";
import PersonalAddress from "./personal-address.component";
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from "react-redux";
import { updateAddressCheck } from "../../../redux/delivery-address/delivery-address.action";

const AddAddress = (props) => {

    const [active, setactive] = useState(true);
    const dispatch = useDispatch();
    let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    const Tabchange = (item) => {
        if (item != undefined) {
            setactive(item);
        }
    }
    const router = useRouter();

    const [loadaddress, setloadaddress] = useState(true);
    const [isclose, setisclose] = useState(false);

    const CloseAddress = () => {
        let addresspopupclose = document.getElementById("addresspopupclose");
        addresspopupclose.click();

        let addresspersonaltab = document.getElementById("addresspersonaltab");
        addresspersonaltab.click();
    }
    
    if (loadaddress === true)
        return (
            <>
                {<div id="myModalregisteraddress" className="modal address fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                    <button type="button" className="close" data-dismiss="modal" id="addresspopupclose" onClick={() => CloseAddress()} ><img src="/images/close.svg" alt="" /></button>
                                    <h3>Add address</h3>
                                </div>
                                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                    <ul className="nav nav-tabs">
                                        <li className="active">
                                            <a className="g-btn size_22" data-toggle="tab" id="addresspersonaltab" href="#tab-1" onClick={() => Tabchange(true)}>Personal</a>
                                        </li>
                                        <li>
                                            <a className="g-btn size_22" data-toggle="tab" href="#tab-2" onClick={() => Tabchange(false)}>Business</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="tab-1" className="tab-pane fade in active">
                                            {<PersonalAddress ispersonal={active} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </>
        )
    return (
        <>
            <div data-dismiss="modal"></div>
        </>
    );
}

export default AddAddress;