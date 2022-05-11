import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addAddress } from "../../../redux/delivery-address/delivery-address.action";
import { GoogleAutoComplete } from "../google.map.component";

const BusinessAddress = () => {
    const dispatch = useDispatch();
    const [addressdetail1, setaddressdetail] = useState({});
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    const [apartment, setapartment] = useState("");
    const [businessname, setbusinessname] = useState("");

    const sendToParent = (index) => {
        var obj = {};
        obj.Address1 = index.address1;
        // obj.Address2 = index.long_name;
        obj.City = index.city;
        obj.State = index.state;
        obj.Country = index.country;
        obj.Postalcode = index.zip;

        obj.latitude = index.lat;
        obj.longitude = index.lng;

        setaddressdetail(index);
    }

    const AddNewAddress = () => {
        var obj = {};
        obj.customerId = customerId;
        obj.othercustomerId = 0;
        obj.deliveryaddressId = 0;
        obj.address1 = addressdetail.Address1 != undefined && addressdetail.Address1;
        obj.address2 = addressdetail.Address2 != undefined && addressdetail.Address2;
        obj.landmark = apartment != undefined && apartment !="" && apartment;
        obj.city = addressdetail.City != undefined && addressdetail.City;
        obj.zipcode = addressdetail.Postalcode != undefined && addressdetail.Postalcode;
        obj.contactno = "";
        obj.contactname = "";
        obj.latitude = addressdetail.latitude;
        obj.longitude = addressdetail.longitude;
        obj.state = addressdetail.State != undefined && addressdetail.State;
        obj.country = addressdetail.Country != undefined && addressdetail.Country;
        obj.addresstype = 1;
        obj.businessname = businessname != undefined && businessname ? businessname : '';
        dispatch(addAddress(obj, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));

        setapartment("");
        setbusinessname("");
    }

    return (
        <form className="customForm">
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <p>Enter your business, hospital, school addresses here</p>
            </div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                {/* <input
                    className="search"
                    ref={autoCompleteRef1}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Enter Your Address1"
                    value={query1}
                />
                <label className="formlabel search">Enter Your Address</label>
                */}
                <GoogleAutoComplete sendToParent={sendToParent} />

            </div>
            <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">&nbsp;</div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <input type="text" placeholder="Business name"  value={businessname} onChange={event => setbusinessname(event.target.value)} required />
                <label className="formlabel">Business name</label>
            </div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <input type="text" placeholder="Address 1" value={addressdetail1.Address1} required />
                <label className="formlabel">Address 1</label>
            </div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <input type="text" placeholder="Address 2" value={addressdetail1.Address2} required />
                <label className="formlabel">Address 2</label>
            </div>
            <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                <input type="text" placeholder="Suite/room number, …" value={addressdetail1.apartment} onChange={event => setapartment(event.target.value)} required />
                <label className="formlabel">Suite/room number, ...</label>
            </div>
            <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                <input type="text" placeholder="City" value={addressdetail1.City} required />
                <label className="formlabel">City</label>
            </div>
            <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                <input type="text" placeholder="Province/State" value={addressdetail1.State} required />
                <label className="formlabel">Province/State</label>
            </div>
            <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                <input type="text" placeholder="Postal code" value={addressdetail1.Postalcode} required />
                <label className="formlabel">Postal code</label>
            </div>
            <div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
                <div className="col-lg-8 column-centered text-center col-sm-12 col-xs-12">
                    <button className="blue_btn blue_btn_porder" type="submit" value="" data-toggle="modal" onClick={() => AddNewAddress()} >Save</button>
                </div>
            </div>
        </form>
    )
}

export default BusinessAddress;