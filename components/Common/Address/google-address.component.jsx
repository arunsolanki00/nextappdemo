import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

const GoogleAddress = () => {

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

    const loadScript = (url, callback) => {
        let script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = () => callback();
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    function handleScriptLoad(updateQuery, autoCompleteRef) {
        autoComplete = new window.google.maps.places.Autocomplete(
            autoCompleteRef.current,
            { types: ["geocode"] }
        );
        autoComplete.addListener("place_changed", () =>
            handlePlaceSelect(updateQuery)
        );
    }

    async function handlePlaceSelect(updateQuery) {
        const addressObject = autoComplete.getPlace();
        const query = addressObject.formatted_address;
        updateQuery(query);
        var adata = addressObject.address_components;

        if (addressObject.geometry.location) {
            let lat = addressObject.geometry.location.lat;
            let lng = addressObject.geometry.location.lng;

            if (lat) { setlatitude(lat); }
            if (lng) { setlongitude(lng); }
        }

        if (adata != undefined) {
            setpostalcode(adata[0] != undefined && adata[0].long_name != undefined && adata[0].long_name);
            setcity(adata[1] != undefined && adata[1].long_name != undefined && adata[1].long_name);
            setaddress1(adata[2] != undefined && adata[2].long_name != undefined && adata[2].long_name);
            setstate(adata[3] != undefined && adata[3].short_name != undefined && adata[3].short_name);
            setcountry(adata[4] != undefined && adata[4].long_name != undefined && adata[4].long_name);
        }
    }
    
    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyB0IdLmv-_FP5qQeEaO2w2m0ReAagdbBBY"}&libraries=places`,
            () => handleScriptLoad(setQuery, autoCompleteRef)
        );
    }, []);

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
        }
    }

    return (
        <>
            <form className="customForm">                
                <div className="col-lg-10 col-sm-10 col-xs-12">
                    <input
                        className="search input-black padding_left_50"
                        ref={autoCompleteRef}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Enter Your Address"
                        value={query}
                    />
                    <label className="formlabel search">Enter Your Address</label>
                </div>
                {/* <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">&nbsp;</div>                 */}
            </form>
        </>
    )
}

export default GoogleAddress;
