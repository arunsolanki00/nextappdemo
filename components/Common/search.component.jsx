import React, { useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { GoogleApiWrapper } from "google-maps-react";
function LocationSearchInput(props) {

  const [address, setaddress] = useState("");
  const [coordinates, setcoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [placeModel, setplaceModel] = useState({
    name: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    console.log(result);
    const latlang = await getLatLng(result[0]);
    const address_component = result[0].address_components;

    var model = {
      name: address_component.length > 1 ? (address_component[0].long_name ? address_component[0].long_name : address_component[0].short_name) : "",
      street_address: address_component.length > 1 ? (address_component[1].long_name ? address_component[1].long_name : address_component[1].short_name) : "",
      address3: address_component.length > 2 ? (address_component[2].long_name ? address_component[2].long_name : address_component[2].short_name) : "",
      city: address_component.length > 3 ? (address_component[3].long_name ? address_component[3].long_name : address_component[3].short_name) : "",
      state: address_component.length > 4 ? (address_component[4].long_name ? address_component[4].long_name : address_component[4].short_name) : "",
      zip_code: address_component.length > 6 ? (address_component[6].long_name ? address_component[6].long_name : address_component[6].short_name) : "",
    };
    setplaceModel(model);
    setaddress(value);
    setcoordinates(latlang);
    props.getAddressFromMap(model);
    //  props.getAddress(latlang);

  };


  return (
    <PlacesAutocomplete
      value={address}
      onChange={setaddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Search Places ...",
              className: "location-search-input",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyB0IdLmv-_FP5qQeEaO2w2m0ReAagdbBBY",
  libraries: ["places"],
})(LocationSearchInput);
// export default LocationSearchInput