import React, { useEffect, useRef, useState } from 'react'
const apiKey = "AIzaSyC6hNIP3xs2wN0tRG3Ue5Vg8seHGZTYnn4";
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';

// load google map api js
function loadAsyncScript(src) {
    return new Promise(resolve => {
        const script = document.createElement("script");
        Object.assign(script, {
            type: "text/javascript",
            async: true,
            src
        })
        script.addEventListener("load", () => resolve(script));
        document.head.appendChild(script);
    })
}

const extractAddress = (place) => {
    const address = {
        city: "",
        state: "",
        zip: "",
        country: "",
        lat:"",
        lng:"",
        plain() {
            const city = this.city ? this.city + ", " : "";
            const zip = this.zip ? this.zip + ", " : "";
            const state = this.state ? this.state + ", " : "";
            const lat= this.lat ? this.lat + ", ":"";
            const lng= this.lng ? this.lng + ", ":"";
            return city + zip + state + this.country + lat + lng;
        }
    }
    if (!Array.isArray(place?.address_components)) {
        return address;
    }
    place.address_components.forEach(component => {
        const types = component.types;
        const value = component.long_name;
        const shortvalue = component.short_name;
        if (types.includes("locality")) {
            address.city = value;
        }
        if (types.includes("street_number")) {
            address.address1 = value + ' ';
        }
        if (types.includes("route")) {
            address.address1 += shortvalue;
        }

        if (types.includes("postal_code")) {
            address.zip = value;
        }

        if (types.includes("country")) {
            address.country = value;
        }

        if (types.includes("administrative_area_level_1")) {
            address.state = shortvalue;
        }
    });
    if(place.geometry?.location){
        address.lat = place.geometry.location.lat();
        address.lng = place.geometry.location.lng();
    }
    return address;
}


export const GoogleAutoComplete = ({ sendToParent }) => {
    const searchInput = useRef();
    const [address, setAddress] = useState({});
    const [query, setQuery] = useState("");

    // init gmap script
    const initMapScript = () => {
        // if script already loaded
        if (window.google) {
            return Promise.resolve();
        }
        const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
        return loadAsyncScript(src);
    }

    // do something on address change
    const onChangeAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        setAddress(extractAddress(place));
        sendToParent(extractAddress(place));
    }

    // init autocomplete
    const initAutocomplete = () => {
        if (!searchInput.current) return;
        var options = {
            componentRestrictions: { country: "ca" }
        };
        const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current, options);
        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.setComponentRestrictions({country:['ca']});
        autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete));
        // autocomplete.styles({"search pac-target-input":"padding-left 35px"})
    }

    const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
        const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;
        searchInput.current.value = "Getting your location...";
        fetch(url)
            .then(response => response.json())
            .then(location => {
                const place = location.results[0];
                const _address = extractAddress(place);
                setAddress(_address);
                extractAddress(_address);
                searchInput.current.value = _address.plain();
            })
    }


    // const findMyLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(position => {
    //             reverseGeocode(position.coords)
    //         })
    //     }
    // }
    // load map script after mounted
    useEffect(() => {
        initMapScript().then(() => initAutocomplete())
    }, []);

    const handlequery=(event)=>{
        console.log(event.target.value);
        setQuery(event.target.value)
    }
    return (
        <div className="App">
            <div>
                {/* <div className="search"> */}
                    {/* <span><Search /></span> */}
                    <input
                        ref={searchInput}
                        className="search"
                        placeholder="Start typing Your Address"
                        // className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        //onChange= {event => setQuery(event.target.value)}
                        //value={query}
                        onFocus={(e) => e.target.placeholder = ""} 
                       type="text"
                    //    style={{paddingLeft:"35px !important"}}
                    />
                    {/* <label className="formlabel search">Enter Your Address</label> */}
                    {/* <button onClick={findMyLocation}>
                        <GpsFixed />
                    </button> */}
                {/* </div> */}

                {/* <div className="address">
                    <p>City: <span>{address.city}</span></p>
                    <p>State: <span>{address.state}</span></p>
                    <p>Zip: <span>{address.zip}</span></p>
                    <p>Country: <span>{address.country}</span></p>
                </div> */}

            </div>
        </div>
    )
}

//export default App
