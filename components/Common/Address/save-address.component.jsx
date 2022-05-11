import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAddress } from "../../../redux/delivery-address/delivery-address.action";
import { DeliveryAddressServices } from "../../../redux/delivery-address/delivery-address.services";
import { selecteddeliveryaddress } from "../../../redux/selected-delivery-data/selecteddelivery.action";
import AddAddress from "./add-address.component";
import DeleteAddress from "./delete-address.component";

const SaveAddressPopup = () => {
    
    const dispatch = useDispatch();
    const deliverydata = useSelector(({ deliveryaddress }) => deliveryaddress.deliveryaddressdata);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const [deliveryaddressId, setdeliveryaddressId] = useState();
    const [deleteadresspopup, setdeleteadresspopup] = useState(false);
    const [addadresspopup, setaddadresspopup] = useState(false);
    const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery.selecteddeliveryaddress);

    const handleaddAddressPopup = () => {
        setaddadresspopup(true);        
    }    
    const router = useRouter()
    const {
        query: { dynamic, id, category, index },
      } = router;
    const handledeleteAddressPopup = (item) => {
        if (item != undefined) {
            setdeleteadresspopup(true);
            setdeliveryaddressId(item?.deliveryaddressId);                                    
        }
    }

    const handleaddressclick = (item) => {
        
        if (item != undefined) {
            popupClose();
            dispatch(selecteddeliveryaddress(item));
            if(router.pathname === "/[dynamic]/deliveryconfirmation"){
                router.push("/" + restaurantinfo.restaurantURL + "/cart");
            }
        }
    }
    const popupClose = () => {
        let savedaddress = document.getElementById("savedaddress");
        if (savedaddress) {
            savedaddress.click();
        }
        $('.modal-backdrop').remove();  
        return;
    }
    return (
        <>
            <div id="mysaveModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <button type="button" className="close" data-dismiss="modal" id="savedaddress">
                                    <img src="/images/close.svg" alt="" /></button>
                                <h3>Saved addresses</h3>
                            </div>
                            <div className="row in">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12 color_red">
                                <h5 className="color_red">Changing location may affect your delivery charge,<br /> and you will redirect to cart page.</h5>
                                </div>
                                <div className="col-lg-6 col-sm-12 col-xs-12">
                                    {deliverydata != undefined && deliverydata && deliverydata.filter(x => x.addresstype === 0).length > 0 &&
                                        <div className="col-lg-12 flush border_radius_20 col-sm-12 col-xs-12">
                                            <h4 className="size_24 color_orange weight_500 margin_bottom_15">Personal Address</h4>
                                        </div>
                                    }
                                    {deliverydata != undefined && deliverydata && deliverydata.filter(x => x.addresstype === 0).length > 0 &&
                                        deliverydata.filter(x => x.addresstype === 0).map((item,index) => {
                                            let bgcolor= item?.deliveryaddressId===selecteddelivery?.deliveryaddressId ? "col-lg-12 margin_top_20 full_grey_border padding_10 border_radius_20 col-sm-12 col-xs-12 bg_grey full_grey_border_selected" :"col-lg-12 margin_top_20 full_grey_border padding_10 border_radius_20 col-sm-12 col-xs-12 ";
                                            return (
                                               
                                                    <div className={bgcolor}  key={index}>
                                                        <h5 className="size_22  color_black weight_300 margin_bottom_20">
                                                            <em className="position_none float_right">
                                                                <a
                                                                    data-dismiss="modal"
                                                                    data-toggle="modal"
                                                                    data-target="#myModaldeleteaddress"
                                                                    onClick={() => handledeleteAddressPopup(item)}
                                                                >
                                                                    <img style={{ maxHeight: 20 }} src="/images/bin-1.svg" alt="" />
                                                                </a>
                                                            </em>
                                                           <a onClick={() => handleaddressclick(item)}> <img src="/images/pin.png" className="float_left mapPin" alt="" />
                                                            <span className="size_20 margin_top_0 color_grey" >{item.address1}{" "}{item.address2}<br /> {item.landmark},<br /> {item.city}<br /> {item.zipcode}</span>
                                                            </a>
                                                        </h5>
                                                    </div>
                                            )
                                        })}
                                </div>
                                <div className="col-lg-6 col-sm-12 col-xs-12">
                                    {deliverydata != undefined && deliverydata && deliverydata.filter(x => x.addresstype === 1).length > 0 &&
                                        < div className="col-lg-12 flush border_radius_20 col-sm-12 col-xs-12">
                                            <h4 className="size_24 color_orange weight_500 margin_bottom_15">Business Address</h4>
                                        </div>
                                    }
                                    {deliverydata != undefined && deliverydata &&
                                        deliverydata.filter(x => x.addresstype === 1).map((item,index) => {
                                             
                                            let bgcolor= item?.deliveryaddressId===selecteddelivery?.deliveryaddressId ? "col-lg-12 margin_top_20 full_grey_border padding_10 border_radius_20 col-sm-12 col-xs-12 bg_grey full_grey_border_selected" :"col-lg-12 margin_top_20 full_grey_border padding_10 border_radius_20 col-sm-12 col-xs-12";
                                            return (
                                                    <div className={bgcolor} key={index}>
                                                        <h5 className="size_22  color_black weight_300 margin_bottom_20">
                                                            <em className="position_none float_right">
                                                                <a
                                                                    data-dismiss="modal"
                                                                    data-toggle="modal"
                                                                    data-target="#myModaldeleteaddress"
                                                                    onClick={() => handledeleteAddressPopup(item)}
                                                                >
                                                                    <img style={{ maxHeight: 20 }} src="/images/bin-1.svg" alt="" />
                                                                </a>
                                                            </em>
                                                            <a onClick={() => handleaddressclick(item)}>
                                                            <img src="/images/pin.png" className="float_left mapPin" alt="" />
                                                            <span className="size_20 margin_top_0 color_grey" onClick={() => handleaddressclick(item)}> {item.businessname && (<> {item.businessname} <br /></>) } {item.address1}{" "}{item.address2}<br /> {item.landmark},<br /> {item.city}<br /> {item.zipcode}</span>
                                                            </a>
                                                        </h5>
                                                    </div>
                                            )
                                        })}
                                </div>
                                <div className="col-lg-12 text-center margin_top_40 col-sm-12 col-xs-12">
                                    <a
                                        className="light_orange_btn address_btn"
                                        data-dismiss="modal"
                                        data-toggle="modal"
                                        data-target="#myModaladdress"
                                        onClick={handleaddAddressPopup}
                                    >+ Add Address</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { deleteadresspopup === true && <DeleteAddress deliveryaddressId={deliveryaddressId} />}
            { addadresspopup === true && <AddAddress />}
        </>
    )
}

export default SaveAddressPopup;