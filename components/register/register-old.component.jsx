import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// import { RegisterModel, AddressModel } from "../../models/register.model";
// import LoginPage from "../../pages/login/login.pages";
import AddressComponent from "../address/address.component";
import { RegisterServices } from "../../redux/register/register.services";
import Link from 'next/link';
import { useRouter } from "next/router"
import Image from "next/image";
import LoginMainComponent from "../login/login.component";
import { useDispatch, useSelector } from "react-redux";


export function RegisterComponent(props) {

  const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

  const [showLogin, setshowLogin] = useState(false);
  const handleShowLogin = () => setshowLogin(true);
  const handleCloseLogin = () => setshowLogin(false);

  const [showAddress, setshowAddress] = useState(false);
  const handleShowAddress = () => setshowAddress(true);
  const handleCloseAddress = () => setshowAddress(false);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addressResponse, setAddressResponse] = useState({
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    zip: "",
    addressType: 0,
    country: "",
  });

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    extension: "",
    password: "",
    confirmpassword: "",
    errors: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      extension: "",
      password: "",
      confirmpassword: "",
    },
  });

  const styleconfig = {
    backgroundColor: "grey",
  };

  function signup(res) {
    const responseFacebook = {
      Name: res.name,
      email: res.email,
      token: res.accessToken,
      Image: res.picture.data.url,
      ProviderId: "Facebook",
    };
  }

  const handlechange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {

    event.preventDefault();
    setErrorMessage("");

    var usermodel = {
      firstname: values.firstname,
      lastname: values.lastname,
      phone: values.phone,
      email: values.email,
      password: values.password,
    };
    var addressmodel = {
      address1: addressResponse.address1,
      address2: addressResponse.address2,
      address3: addressResponse.address3,
      city: addressResponse.city,
      state: addressResponse.state,
      country: addressResponse.country,
      zipcode: addressResponse.zip,
      addressType: addressResponse.addressType,
    };

    console.log(addressmodel);

    setErrorMessage("");

    if (validateForm(event)) {
      console.log("Valid Form");

      RegisterServices.registerUser(usermodel, addressmodel).then((response) => {

        if (response && response != null) {
          if (response.message !== null && response.status == 2) {
            return setErrorMessage(response.message);
          } else if (response.message === null && response.status == 2) {
            return setErrorMessage("User not created Something went wrong");
          } else if (response.status == 1) {
            return setErrorMessage("User created successfully");
          }
        }
      });
    }
  };
  const validateForm = (event) => {

    event.preventDefault();
    const confirmpassword = values.confirmpassword;
    let errors = values.errors;
    let valid = true;

    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    errors.phone = values.phone.length === 0 ? "Phone must be required" : "";
    errors.password =
      values.password.length === 0 ? "Password must be required" : "";
    errors.firstname =
      values.firstname.length === 0 ? "Firstname must be required" : "";
    errors.lastname =
      values.lastname.length === 0 ? "Lastname must be required" : "";
    errors.email = values.email.length === 0 ? "Email must be required" : "";

    errors.email = pattern.test(values.email) === false ? "Please enter valid email address" : "";
    // if (!pattern.test(values.email)) {
    //   isValid = false;
    //   errors["email"] = "Please enter valid email address.";
    // }


    errors.password =
      values.password.length === 0 ? "Password must be required" : "";
    errors.confirmpassword =
      values.confirmpassword ? "Confirm Password must be required" : "";
    errors.password =
      values.confirmpassword && values.confirmpassword !== values.password
        ? "Password and confirm password must be same"
        : "";

    setValues({
      errors,
    });

    if (
      errors.firstname.length > 0 ||
      errors.lastname.length > 0 ||
      errors.phone.length > 0 ||
      errors.password.length > 0 ||
      errors.confirmpassword.length > 0
    ) {
      setIsSubmitted(true);
      return (valid = false);
    } else {
      return valid;
    }
  };
  const registerUser = async (user, address) => {
    const getResponse = await registerUserService(user, address);
    return getResponse;
  };

  const handleGetAddress = (address) => {

    setAddressResponse(address);
    handleCloseAddress();
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
          <div className="col-lg-12 text-center col-sm-12 col-xs-12">
            <h1>Register</h1>
          </div>
        </div>
        <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
          <div className="col-lg-10 column-centered col-sm-12 col-xs-12">
            <div className="row">
              <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                <a className="s-btn fb" href="#">
                  <img src="/images/icon-fb.svg" alt="" />
                  Login with Facebook
                </a>
              </div>
              <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                <a className="s-btn gp" href="#">
                  <img src="/images/icon-google.svg" alt="" />
                  Login with Google
                </a>
              </div>
              <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                <a className="s-btn app" href="#">
                  <img src="/images/icon-apple.svg" alt="" />
                  Login with Apple
                </a>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-9 register flush column-centered col-sm-12 col-xs-12">
                <Form
                  className="customForm"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <hr />
                    <span className="or top">OR</span>
                  </div>
                  <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input
                      className=""
                      type="text"
                      name="firstname"
                      value={values.firstname}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">First name</label>
                    {values.errors.firstname.length > 0 && isSubmitted && (
                      <span className="error">
                        {values.errors.firstname}
                      </span>
                    )}
                  </div>
                  <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input
                      className
                      type="text"
                      name="lastname"
                      value={values.lastname}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Last name</label>
                    {values.errors.lastname.length > 0 && isSubmitted && (
                      <span className="error">
                        {values.errors.lastname}
                      </span>
                    )}
                  </div>
                  <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <input
                      className
                      type="text"
                      name="email"
                      value={values.email}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Email</label>
                    {values.errors.email.length > 0 && isSubmitted && (
                      <span className="error">{values.errors.email}</span>
                    )}
                  </div>
                  <div className="col-lg-8 text-center col-sm-8 col-xs-12">
                    <input
                      className
                      type="text"
                      name="phone"
                      value={values.phone}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Phone</label>
                    {values.errors.phone.length > 0 && isSubmitted && (
                      <span className="error">{values.errors.phone}</span>
                    )}
                  </div>
                  <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                    <input
                      className
                      type="text"
                      placeholder="Extension"
                      required
                    />
                    <label className="formlabel">Extension</label>
                  </div>
                  <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input
                      className
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Password</label>
                    {values.errors.password.length > 0 && isSubmitted && (
                      <span className="error">
                        {values.errors.password}
                      </span>
                    )}
                  </div>
                  <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                    <input
                      className
                      type="password"
                      placeholder="Re-enter password"
                      name="confirmpassword"
                      value={values.confirmpassword}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Re-enter password</label>
                    {values.errors.confirmpassword && values.errors.confirmpassword.length > 0 &&
                      isSubmitted && (
                        <span className="error">
                          {values.errors.confirmpassword}
                        </span>
                      )}
                    {errorMessage !== null && (
                      <span className="error">{errorMessage}</span>
                    )}
                  </div>
                  <div className="col-lg-12 text-center flush col-sm-12 col-xs-12">
                    <div className="col-lg-12 flush column-centered col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <a
                          className="light_orange_btn address_btn"
                          data-toggle="modal"
                          data-target="#myModal-address"
                          onClick={handleShowAddress}
                        >
                          + Add address
                        </a>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <button
                          className="light_orange_btn address_btn"
                          type="submit"
                          defaultValue="Register"
                          value="Register"
                        >
                          Register
                        </button>
                      </div>
                      <div className="col-lg-5 column-centered col-sm-5 col-xs-12">
                        <a
                          className="regi"
                          data-toggle="modal"
                          data-target="#myModal-logintest"
                          onClick={handleShowLogin}
                        >
                          Login
                        </a>
                      </div>
                    </div>
                  </div>
                  {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
                  {/* <Modal
                    show={showLogin}
                    onHide={handleCloseLogin}
                    className="modal fade in"
                    style={styleconfig}
                  >
                    <Modal.Body>
                      <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                        >
                          <img
                            src="/images/close.svg"
                            alt=""
                            onClick={handleCloseLogin}
                          />
                        </button>
                        <h3>Login</h3>
                      </div>
                      {
                        <LoginMainComponent
                          handleLoginClose={handleCloseLogin}
                        />
                      }
                    </Modal.Body>
                  </Modal> */}

                  <Modal
                    show={showAddress}
                    onHide={handleCloseAddress}
                    className="modal fade in"
                    style={styleconfig}
                  >
                    <Modal.Body>
                      <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                        >
                          <img
                            src="/images/close.svg"
                            alt=""
                            onClick={handleCloseAddress}
                          />
                        </button>
                        <h3>Add address</h3>
                      </div>
                      {
                        <AddressComponent
                          handleGetAddress={(addressresponse) =>
                            handleGetAddress(addressresponse)
                          }
                        />
                      }
                    </Modal.Body>
                  </Modal>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterComponent;
