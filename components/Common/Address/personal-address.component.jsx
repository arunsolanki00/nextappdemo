import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addAddress, getAddress } from "../../../redux/delivery-address/delivery-address.action";
import $ from "jquery";
import { GoogleAutoComplete } from "../google.map.component";

const PersonalAddress = ({ ispersonal, sendDataToParent }) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [addressdetail, setaddressdetail] = useState({});
    const autoCompleteRef = useRef(null);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    let autoComplete;

    const [businessname, setbusinessname] = useState("");
    const [address1, setaddress1] = useState("");
    const [address2, setaddress2] = useState("");
    const [roomnumber, setroomnumber] = useState("");
    const [city, setcity] = useState("");
    const [state, setstate] = useState("");
    const [postalcode, setpostalcode] = useState("");
    const [country, setcountry] = useState("");
    const [apartment, setapartment] = useState("");
    const [latitude, setlatitude] = useState();
    const [longitude, setlongitude] = useState();

    // const loadScript = (url, callback) => {
    //     let script = document.createElement("script");
    //     script.type = "text/javascript";

    //     if (script.readyState) {
    //         script.onreadystatechange = function () {
    //             if (script.readyState === "loaded" || script.readyState === "complete") {
    //                 script.onreadystatechange = null;
    //                 callback();
    //             }
    //         };
    //     } else {
    //         script.onload = () => callback();
    //     }

    //     script.src = url;
    //     document.getElementsByTagName("head")[0].appendChild(script);
    // };

    // function handleScriptLoad(updateQuery, autoCompleteRef) {
    //     autoComplete = new window.google.maps.places.Autocomplete(
    //         autoCompleteRef.current,
    //         { types: ["geocode"] }
    //     );
    //     autoComplete.addListener("place_changed", () =>
    //         handlePlaceSelect(updateQuery)
    //     );
    // }

    // async function handlePlaceSelect(updateQuery) {
    //     const addressObject = autoComplete.getPlace();
    //     const query = addressObject.formatted_address;
    //     updateQuery(query);
    //     var adata = addressObject.address_components;

    //     if (addressObject.geometry.location) {
    //         let lat = addressObject.geometry.location.lat;
    //         let lng = addressObject.geometry.location.lng;

    //         if (lat) { setlatitude(lat); }
    //         if (lng) { setlongitude(lng); }
    //     }

    //     if (adata != undefined) {
    //         setpostalcode(adata[0] != undefined && adata[0].long_name != undefined && adata[0].long_name);
    //         setcity(adata[1] != undefined && adata[1].long_name != undefined && adata[1].long_name);
    //         setaddress1(adata[2] != undefined && adata[2].long_name != undefined && adata[2].long_name);
    //         setstate(adata[3] != undefined && adata[3].short_name != undefined && adata[3].short_name);
    //         setcountry(adata[4] != undefined && adata[4].long_name != undefined && adata[4].long_name);
    //     }
    // }

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
        setroomnumber("");
        setcountry("");
        setapartment("");
        setlongitude("");
        setlatitude("");
    }, [ispersonal])

    // useEffect(() => {
    //     loadScript(
    //         `https://maps.googleapis.com/maps/api/js?key=${"testapi"}&libraries=places`,
    //         () => handleScriptLoad(setQuery, autoCompleteRef)
    //     );
    // }, []);

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

            dispatch(addAddress(obj, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
            sendDataToParent(false);

            setQuery("");
            setbusinessname("");
            setaddress1("");
            setaddress2("");
            setcity("");
            setstate("");
            setcountry("");
            setpostalcode("");
            setroomnumber("");
            setcountry("");
            setapartment("");

            dispatch(getAddress(userinfo ? userinfo.customerId : 0, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
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
                    {/* <input
                        className="search"
                        ref={autoCompleteRef}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Enter Your Address"
                        value={query}
                    /> */}
                     <GoogleAutoComplete sendToParent={sendToParent} />
                    {/* <label className="formlabel search">Enter Your Address</label> */}
                </div>
                <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">&nbsp;</div>

                {ispersonal === false &&
                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                        <input type="text" placeholder="Business name" value={businessname} onChange={event => setbusinessname(event.target.value)} required />
                        <label className="formlabel">Business name</label>
                    </div>}

                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <input id={"address1Field"} type="text" placeholder="Address 1" value={address1} onChange={event => setaddress1(event.target.value)} disabled/>
                    {(address1 == "" || address1 == null) && <label className="formlabel">Address 1</label>}
                </div>
                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <input type="text" placeholder="Address 2" value={address2} onChange={event => setaddress2(event.target.value)} disabled/>
                    <label className="formlabel">Address 2</label>
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