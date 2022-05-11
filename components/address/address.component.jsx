import React, { useState, useEffect } from "react";
import {
  Form,
  Tab,
  Tabs,
  Nav,
} from "react-bootstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { AddressTypes } from "../../redux/address/address.types";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import LocationSearchInput from "../Common/search.component";

const AddressComponent = (props) => {

  const { error, loading, products, handleLoginClose, getAddress } = props;
  const dispatch = useDispatch();
  const [addressType, setAddressType] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [key, setKey] = useState("personal");
  const [placeInfo, setplaceInfo] = useState(null);
  const [pvalues, setPValues] = useState({
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    zip: "",
    addressType: 0,
    country: "",
    errors: {
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const [bvalues, setBValues] = useState({
    businessname: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    zip: "",
    addressType: 0,
    country: "",
    errors: {
      businessname: "",
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      zip: "",
    },
  });


  const [address, setaddress] = useState('');
  const [autocomplete, setautocomplete] = useState('');
  const [placeModel, setplaceModel] = useState({
    name: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  // function getDataFromState(){
  //   const address1 = useSelector(state => state.address1);
  //   const addressState = useSelector(state => state);
  //   dispatch();
  // }

  // const useraddress1Data = useSelector(({address}) => address.address1);
  //const useraddressData = useSelector(state => state.address);

  const validateForm = (event) => {
    event.preventDefault();
    let errors = "";
    let valid = false;

    if (key === "personal") {
      errors = pvalues.errors;
      valid = true;

      errors.address1 = pvalues.address1.length === 0 ? "Address 1 must be required" : "";
      errors.address2 = pvalues.address2.length === 0 ? "Address 2 must be required" : "";
      errors.address3 = pvalues.address3.length === 0 ? "Address 3 must be required" : "";
      errors.city = pvalues.city.length === 0 ? "City must be required" : "";
      errors.state = pvalues.state.length === 0 ? "State must be required" : "";
      errors.zip = pvalues.zip.length === 0 ? "Zip must be required" : "";

      setPValues({
        errors,
      });
    }
    else {
      errors = bvalues.errors;
      valid = true;
      errors.address1 = bvalues.address1.length === 0 ? "Address 1 must be required" : "";
      errors.address2 = bvalues.address2.length === 0 ? "Address 2 must be required" : "";
      errors.address3 = bvalues.address3.length === 0 ? "Address 3 must be required" : "";
      errors.city = bvalues.city.length === 0 ? "City must be required" : "";
      errors.state = bvalues.state.length === 0 ? "State must be required" : "";
      errors.zip = bvalues.zip.length === 0 ? "Zip must be required" : "";
      setBValues({
        errors,
      });
    }

    if (
      errors.address1.length > 0 ||
      errors.address2.length > 0 ||
      errors.address3.length > 0 ||
      errors.city.length > 0 ||
      errors.state.length > 0 ||
      errors.zip.length > 0
    ) {
      setIsSubmitted(true);
      return (valid = false);
    } else {
      return (valid = true);
    }
  };

  const handlePersonalChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target;

    setPValues({
      ...pvalues,
      [name]: value,
    });
  };

  const handleBusinessChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target;

    setBValues({
      ...bvalues,
      [name]: value,
    });
  };

  const handleSetPlace = (placeModel) => {

    setplaceModel(placeModel);
    if (placeModel !== null) {
      if (addressType === 0) {
        pvalues.address1 = placeModel.name;
        pvalues.address2 = placeModel.street_address;
        pvalues.address3 = placeModel.address3;
        pvalues.city = placeModel.city;
        pvalues.state = placeModel.state;
        pvalues.zip = placeModel.zip_code;

        setPValues(pvalues);
      }
      if (addressType === 1) {
        bvalues.address1 = placeModel.name;
        bvalues.address2 = placeModel.street_address;
        bvalues.address3 = placeModel.address3;
        bvalues.city = placeModel.city;
        bvalues.state = placeModel.state;
        bvalues.zip = placeModel.zip_code;
        setBValues(placeModel);
      }
    }

  };


  const handleSubmit = (event) => {
    event.preventDefault();

    var addressModel = null;
    if (key === "personal") {
      addressModel = {
        address1: pvalues.address1,
        address2: pvalues.address2,
        address3: pvalues.address3,
        city: pvalues.city,
        state: pvalues.state,
        zip: pvalues.zip,
        country: pvalues.country,
        addressType: addressType,
      };
    } else {
      addressModel = {
        address1: bvalues.address1,
        address2: bvalues.address2,
        address3: bvalues.address3,
        city: bvalues.city,
        state: bvalues.state,
        zip: bvalues.zip,
        country: bvalues.country,
        addressType: addressType,
      };
    }


    if (validateForm(event)) {
      console.log("Valid Form");


      dispatch({
        type: AddressTypes.ADD_ADDRESS,
        payload: addressModel,
      });

      //getuseraddress(addressModel);
      getAddress(addressModel);
      //useraddressData();
      // handleLoginClose(false);
    } else {
      console.log("Invalid Form");
    }
  };


  const initialState = () => {
    // woohoo, just an object that represents an empty parlor
    return {
      name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      googleMapLink: ''
    }
  }

  function handleTab(addressType, key) {
    setAddressType(addressType);
    setKey(key);
  }
  const Personal = () => {
    return (
      <Form className="customForm" id="personalform">
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <p>
            For business, hospital, school addresses etc, please use the <br />
            <span>Business tab</span>
          </p>
        </div>
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          {/* <input
            className="search"
            type="text"
            placeholder="Address"
            required
          />
          <label className="formlabel search">Address</label> */}
          <LocationSearchInput getAddressFromMap={(addressresponse) =>
            handleSetPlace(addressresponse)} />
        </div>
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <input
            type="text"
            placeholder="Enter home, friend address…"
            required
          />
          <label className="formlabel">Enter home, friend address…</label>
        </div>
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <hr />
          <span className="or">OR</span>
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Address 1"
            required
            name="address1"
            value={pvalues.address1}
            onChange={handlePersonalChange}
            className=""
          />
          <label className="formlabel">Address 1</label>
          {pvalues.errors.address1.length > 0 && isSubmitted && (
            <span className="error">{pvalues.errors.address1}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Address 2"
            required
            name="address2"
            value={pvalues.address2}
            onChange={handlePersonalChange}
            className=""
          />
          <label className="formlabel">Address 2</label>
          {pvalues.errors.address2.length > 0 && isSubmitted && (
            <span className="error">{pvalues.errors.address2}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Enter Apt, Buzzer,…"
            required
            name="address3"
            value={pvalues.address3}
            onChange={handlePersonalChange}
            className=""
          />
          <label className="formlabel">Enter Apt, Buzzer,…</label>
          {pvalues.errors.address3.length > 0 && isSubmitted && (
            <span className="error">{pvalues.errors.address3}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="City"
            required
            name="city"
            value={pvalues.city}
            onChange={handlePersonalChange}
            className=""
          />
          <label className="formlabel">City</label>
          {pvalues.errors.city.length > 0 && isSubmitted && (
            <span className="error">{pvalues.errors.city}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Province/State"
            required
            name="state"
            value={pvalues.state}
            onChange={handlePersonalChange}
            className=""
          />
          <label className="formlabel">Province/State</label>
          {pvalues.errors.state.length > 0 && isSubmitted && (
            <span className="error">{pvalues.errors.state}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Postal code"
            required
            name="zip"
            value={pvalues.zip}
            onChange={handlePersonalChange}
            className=""
          />
          <label className="formlabel">Postal code</label>
          {pvalues.errors.zip.length > 0 && isSubmitted && (
            <span className="error">{pvalues.errors.zip}</span>
          )}
        </div>
        <div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
          <div className="col-lg-8 column-centered text-center col-sm-12 col-xs-12">
            <input
              className="submit blue-btn active"
              type="button"
              defaultValue="Apply"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Form>
    );
  };

  const Business = () => {
    return (
      <Form className="customForm" id="businessform">
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <p>Enter your business, hospital, school addresses here</p>
        </div>
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <input
            className="search"
            type="text"
            placeholder="Address"
            required
          />
          <label className="formlabel search">Address</label>
        </div>
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <hr />
          <span className="or">OR</span>
        </div>
        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
          <input type="text" placeholder="Business name" required />
          <label className="formlabel">Business name</label>
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Address 1"
            required
            name="address1"
            value={bvalues.address1}
            onChange={handleBusinessChange}
            className=""
          />
          <label className="formlabel">Address 1</label>
          {bvalues.errors.address1.length > 0 && isSubmitted && (
            <span className="error">{bvalues.errors.address1}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Address 2"
            required
            name="address2"
            value={bvalues.address2}
            onChange={handleBusinessChange}
            className=""
          />
          <label className="formlabel">Address 2</label>
          {bvalues.errors.address2.length > 0 && isSubmitted && (
            <span className="error">{bvalues.errors.address2}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Suite/room number, …"
            required
            name="address3"
            value={bvalues.address3}
            onChange={handleBusinessChange}
            className=""
          />
          <label className="formlabel">Suite/room number, ...</label>
          {bvalues.errors.address3.length > 0 && isSubmitted && (
            <span className="error">{bvalues.errors.address3}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="City"
            required
            name="city"
            value={bvalues.city}
            onChange={handleBusinessChange}
            className=""
          />
          <label className="formlabel">City</label>
          {bvalues.errors.city.length > 0 && isSubmitted && (
            <span className="error">{bvalues.errors.city}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Province/State"
            required
            name="state"
            value={bvalues.state}
            onChange={handleBusinessChange}
            className=""
          />
          <label className="formlabel">Province/State</label>
          {bvalues.errors.state.length > 0 && isSubmitted && (
            <span className="error">{bvalues.errors.state}</span>
          )}
        </div>
        <div className="col-lg-6 text-center col-sm-6 col-xs-12">
          <input
            type="text"
            placeholder="Postal code"
            required
            name="zip"
            value={bvalues.zip}
            onChange={handleBusinessChange}
            className=""
          />
          <label className="formlabel">Postal code</label>
          {bvalues.errors.zip.length > 0 && isSubmitted && (
            <span className="error">{bvalues.errors.zip}</span>
          )}
        </div>
        <div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
          <div className="col-lg-8 column-centered text-center col-sm-12 col-xs-12">
            <input
              className="submit blue-btn active"
              type="button"
              onClick={handleSubmit}
              defaultValue="Apply"
            />
          </div>

        </div>
      </Form>
    );
  };
  return (
    <div className="addresspopup">
      <div className="col-lg-12 text-center col-sm-12 col-xs-12">

        <Nav as="ul" className="nav nav-tabs">
          <Nav.Item as="li" className={key === "personal" ? "active" : ""}>
            <Nav.Link
              className="g-btn"
              eventKey="personal"
              onClick={() => {
                handleTab(0, "personal");
              }}
            >
              Personal
            </Nav.Link>
          </Nav.Item>

          <Nav.Item as="li" className={key === "business" ? "active" : ""}>
            <Nav.Link
              className="g-btn"
              title="Business"
              eventKey="business"
              onClick={() => {
                handleTab(1, "business");
              }}
            >
              Business
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {key === "personal" ? (
          <Tabs className="tab-content">
            <Tab
              eventKey="personal"
              id="tab-1"
              className="tab-pane fade in active"
            >
              <Personal />
            </Tab>
          </Tabs>
        ) : (
            <Tabs className="tab-content">
              <Tab eventKey="business" id="tab-2" className="tab-pane fade in active">
                <Business />
              </Tab>
            </Tabs>
          )}


      </div>
    </div>
  );
};

export default AddressComponent;
