import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addAddress, getAddress, registerAddress } from "../../../redux/delivery-address/delivery-address.action";
import $ from "jquery";
import { GoogleAutoComplete } from "../google.map.component";

const PersonalAddress = ({ ispersonal }) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;

    const [businessname, setbusinessname] = useState("");
    const [address1, setaddress1] = useState("");
    const [address2, setaddress2] = useState("");
    const [city, setcity] = useState("");
    const [state, setstate] = useState("");
    const [postalcode, setpostalcode] = useState("");
    const [country, setcountry] = useState("");
    const [apartment, setapartment] = useState("");
    const [latitude, setlatitude] = useState();
    const [longitude, setlongitude] = useState();

    const sendToParent = (index) => {
        setpostalcode(index.zip);
        setcity(index.city);
        setaddress1(index.address1);
        setstate(index.state);
        setcountry(index.country);

        setlatitude(index.lat);
        setlongitude(index.lng);
    }

    useEffect(() => {
        setQuery("");
        setbusinessname("");
        setaddress1("");
        setaddress2("");
        setcity("");
        setstate("");
        setcountry("");
        setpostalcode("");
        setcountry("");
        setapartment("");
        setlongitude("");
        setlatitude("");
    }, [ispersonal])

    const AddNewAddress = () => {
        if (address1 != undefined && city != undefined && state != undefined && postalcode != undefined &&
            address1 != "" && city != "" && state != "" && postalcode != "") {
            var obj = {};
            obj.customerId = customerId;
            obj.othercustomerId = 0;
            obj.deliveryaddressId = 0;
            obj.address1 = address1 != undefined && address1;
            obj.address2 = address2 != undefined && address2;
            obj.landmark = apartment != undefined && apartment;
            obj.city = city != undefined && city;
            obj.zipcode = postalcode != undefined && postalcode;
            obj.contactno = "";
            obj.contactname = "";
            obj.latitude = latitude;
            obj.longitude = longitude;
            obj.state = state != undefined && state;
            obj.country = country != undefined && country;
            obj.addresstype = ispersonal === false ? 1 : 0;
            obj.businessname = businessname != undefined && businessname ? businessname : '';

            dispatch(registerAddress(obj));

            setQuery("");
            setbusinessname("");
            setaddress1("");
            setaddress2("");
            setcity("");
            setstate("");
            setcountry("");
            setpostalcode("");
            setcountry("");
            setapartment("");

            let addresspopupclose = document.getElementById("addresspopupclose");
            addresspopupclose.click();

            let addresspersonaltab = document.getElementById("addresspersonaltab");
            addresspersonaltab.click();
        }
    }

    return (
        <>
            <form className="customForm">
                <div className="customForm col-lg-12 text-center col-sm-12 col-xs-12">
                    {ispersonal === false && <p>Enter your business, hospital, school addresses here</p>}
                    {ispersonal === true && <p>For business, hospital, school addresses etc, please use the
                        <br /><span>Business tab</span>
                    </p>}
                </div>
                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <GoogleAutoComplete sendToParent={sendToParent} />

                </div>
                <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">&nbsp;</div>

                {ispersonal === false &&
                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                        <input type="text" placeholder="Business name" value={businessname} onChange={event => setbusinessname(event.target.value)} required />
                        <label className="formlabel">Business name</label>
                    </div>}

                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <input id={"address1Field"} type="text" placeholder="Address 1" value={address1} onChange={event => setaddress1(event.target.value)} required disabled/>
                    {(address1 == "" || address1 == null) && <label className="formlabel">Address 1</label>}

                </div>
                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <input type="text" placeholder="Address 2" value={address2} onChange={event => setaddress2(event.target.value)} disabled/>
                    {(address2 == "" || address2 == null) && <label className="formlabel">Address 2</label>}
                </div>
                <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input type="text" placeholder="Enter Apt, Buzzer,…" value={apartment} onChange={event => setapartment(event.target.value)} required />
                    <label className="formlabel">Enter Apt, Buzzer,…</label>
                </div>
                <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input type="text" placeholder="City" value={city} onChange={event => setcity(event.target.value)} disabled />
                    {(city == "" || city == null) && <label className="formlabel">City</label>}
                </div>
                <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input type="text" placeholder="Province/State" value={state} onChange={event => setstate(event.target.value)} disabled />
                    {(state == "" || state == null) && <label className="formlabel">Province/State</label>}
                </div>
                <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input type="text" placeholder="Postal code" value={postalcode} onChange={event => setpostalcode(event.target.value)} disabled />
                    {(postalcode == "" || postalcode == null) && <label className="formlabel">Postal code</label>}
                </div>
                <div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
                    <div className="col-lg-8 column-centered text-center col-sm-12 col-xs-12">
                        <button className="blue_btn blue_btn_porder" onClick={AddNewAddress} >Save</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default PersonalAddress;