import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { RegisterServices } from "../../redux/register/register.services";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, RecaptchaVerifier ,signInWithPhoneNumber} from "firebase/auth";
import Image from "next/image";
import LoginMainComponent from "../login/login.component";
import { Custombutton } from "../Common/button/custombutton";
import { useDispatch, useSelector } from "react-redux";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import handleNotify from "../helpers/toaster/toaster-notify";
import AddAddress from "../Common/Register-Address/add-address.component";
import AddressesListComponent from "./addressesList.component";
import { registerAddress } from "../../redux/delivery-address/delivery-address.action";
import * as firebase from 'firebase/app';
import { UserDetailsErrormessage } from "../helpers/static-message/userdetails-message";
import { OrderServices } from "../../redux/order/order.services";
import { LoginServices } from "../../redux/login/login.services";
import { LoginTypes } from "../../redux/login/login.types";
import { initialrewardpoint } from "../../redux/cart/cart.action";
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import $ from "jquery";
export const RegisterComponent=(props)=> {
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail
  );
  let registerAddressdata = useSelector(
    ({ deliveryaddress }) => deliveryaddress.registeraddress
  );
  const [loadComplete, setLoadComplete] = useState(false);
  function reloadAddressList() {
    setLoadComplete(false);
  }
  const dispatch = useDispatch();
  const router = useRouter();
  const [addadresspopup, setaddadresspopup] = useState(false);
  const handleaddAddressPopup = () => {
    setaddadresspopup(true);
  };
  const [showLogin, setshowLogin] = useState(false);
  const handleShowLogin = () => setshowLogin(true);
  const handleCloseLogin = () => setshowLogin(false);
  const [showAddress, setshowAddress] = useState(false);
  const handleShowAddress = () => setshowAddress(true);
  const handleCloseAddress = () => setshowAddress(false);
  const [IsShowReSend, setIsShowReSend] = useState(false);
  const [OTPDetail, setOTPDetail] = useState();
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isdisable, setisdisable] = useState(false);
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    extension: "",
    password: "",
    confirmpassword: "",
    otp: "",
    isVerifiedPhone:"",
  });
  const [dialCode,setDialCode]=useState("");
  const [countries, setcountries] = useState();
  const [selectedCountryCode, setselectedCountryCode] = useState();

  useEffect(() => {
    OrderServices.getAllCountry().then((response) => {
      if (response && response.result.countryList.length > 0) {
        setcountries(response.result.countryList);
      }
    });
  }, []);

  function signup(res) {
    const responseFacebook = {
      Name: res.name,
      email: res.email,
      token: res.accessToken,
      Image: res.picture.data.url,
      ProviderId: "Facebook",
    };
  }

  function cleardata() {
    setValues({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      extension: "",
      password: "",
      confirmpassword: "",
      otp: "",
      isVerifiedPhone:"",
    });
    dispatch(registerAddress({}));
  }

  const handlechange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
   if(name==="phone"){
    errors.phone="";
    if(
      ( errors.firstname=== "" || errors.firstname=== undefined) &&
      ( errors.lastname ===  "" || errors.lastname=== undefined) &&
      ( errors.email ===  "" || errors.email=== undefined) &&
      ( errors.password ===  "" || errors.password=== undefined) &&
      ( errors.confirmpassword ===  "" || errors.confirmpassword=== undefined)
    ){
    if(errors.phone.length===0){
      setisdisable(false)
    }
  }
    let regex1=/(\(?\d{1,2})/;
    let regex2=/^(\(?\d{1,})\)?(\d{1,}?)(\-?\d{1,})$/;
    let regex3=/^\($/;
    let validdigit=/^\d{1,}$/;
    let phoneno=value.replace('(','').replace(')','').replace('-','').replace(' ','');
    if(phoneno.length > 11)
     return;
     if(phoneno === "")
     setValues({
      ...values,
      [name]: value,
    });

    if((regex1.test(phoneno) || regex2.test(phoneno) || (regex3.test(phoneno) ))  && validdigit.test(phoneno)){
               setValues({
         ...values,
         [name]: value,
       });
       if(phoneno.length===10){
        setValues({
          ...values,
          [name]: value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
       }
       if(phoneno.length < 10){
        setValues({
          ...values,
          [name]: value.replace('(','').replace(')','').replace('-','').replace(' ',''),
        });
      }
       return;
    }
   }
   else{
    setValues({
      ...values,
      [name]: value,
    });
   }
   setErrors({
    ...errors,
    [name]: "",
  });
    if (
      (errors.firstname && errors.firstname.length > 0) ||
      (errors.lastname && errors.lastname.length > 0) ||
      (errors.email && errors.email.length > 0) ||
      (errors.phone && errors.phone.length > 0) ||
      (errors.password && errors.password.length > 0) ||
      (errors.confirmpassword && errors.confirmpassword.length > 0)
    ) {
    
      setisdisable(true)
    } else {
      setisdisable(false)
    }
  };
   const handlePaste=(e)=>{
    e.preventDefault();
    let { name} = e.target
    let pastedValue = e.clipboardData.getData("text")
    if(Number(pastedValue)){
     if(pastedValue.length>8){
      console.log(e.target.value) 
       e.target.value=pastedValue;
       console.log(e.target.value)
       let valuephone="";
       valuephone=e.target.value
       let replacedvalue=valuephone.replace(/(\d{3})(\d{3})(\d{3})/, "($1) $2-$3");
    setValues({
      ...values,
      [name]:replacedvalue,
    });
  }
}
else{
  return;
}
   }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    let unformatedphone=values.phone.replace('(','').replace(')','').replace('-','').replace(' ','');
    var usermodel = {
      firstname: values.firstname,
      lastname: values.lastname,
      phone: unformatedphone,
      email: values.email,
      password: values.password,
      countrycode: dialCode,
      isVerifiedPhone: values.isVerifiedPhone === "" ?false:true,
    };
    var addressmodel = {
      address1: registerAddressdata.address1,
      address2: registerAddressdata.address2,
      landmark: registerAddressdata.landmark,
      city: registerAddressdata.city,
      state: registerAddressdata.state,
      country: registerAddressdata.country,
      zipcode: registerAddressdata.zipcode,
      addresstype: registerAddressdata.addresstype,
      businessname: registerAddressdata.businessname,
    };
    setErrorMessage("");
    if (validateForm(event)) {
      if (addressmodel.address1 != undefined && addressmodel.address1 != "") {
        console.log(usermodel);
        RegisterServices.registerUser(
          usermodel,
          addressmodel,
          restaurantinfo.defaultlocationId,
          restaurantinfo.restaurantId
        ).then((response) => {
          if (response && response != null) {
            if (response.message !== null && response.status == 2) {
              handleNotify(
                response.message,
                ToasterPositions.TopRight,
                ToasterTypes.Warning
              );
              cleardata();
              return setErrorMessage(response.message);
            } else if (response.message === null && response.status == 2) {
              handleNotify(
                "User not created Something went wrong",
                ToasterPositions.TopRight,
                ToasterTypes.Warning
              );
              cleardata();
              return setErrorMessage("User not created Something went wrong");
            } else if (response.status == 1) {
              handleNotify(
                "User created successfully",
                ToasterPositions.TopRight,
                ToasterTypes.Success
              );
              setErrorMessage("User created successfully");

              setTimeout(() => {
                LoginServices.getLoginUserDetails(values.phone, values.password, restaurantinfo.restaurantId).then(responsedata => {
                  if (responsedata !== null && responsedata.customerDetails !== null && responsedata.customerDetails !== undefined) {
                    console.log("login success");
                    dispatch({
                      type: LoginTypes.USER_DETAIL,
                      payload: responsedata.customerDetails,
                    });

                    if (responsedata.customerDetails) {
                      dispatch(initialrewardpoint(responsedata.customerDetails));
                    }
                  }
                })
              }, 1000);

              cleardata();

              let url = window.location.href;
              if (url.includes("register")) {
                router.push("/" + restaurantinfo.restaurantURL+"/pickup");
              }
              return;
            }
          }
        });
      } else {
        handleNotify(
          "Please select address before register !!",
          ToasterPositions.TopRight,
          ToasterTypes.Warning
        );
      }
    }
  };

  useEffect(() => {
    if (restaurantinfo.smsapigateway === 1 && restaurantinfo.enableotpauthentication === true) {
      RegisterServices.getOTPVerificationSetting(
        restaurantinfo.restaurantId,
        restaurantinfo.enableotpauthentication,
        restaurantinfo.smsapigateway
      ).then((response) => {
        if (response && response != null) {
          setOTPDetail(response);
        }
      })
    }
  }, []);

  useEffect(() => {
    if (OTPDetail && OTPDetail !== undefined && OTPDetail !== null && restaurantinfo.enableotpauthentication === true) {
      if (!firebase.getApps().length) {
        const app = firebase.initializeApp({
          apiKey: "AIzaSyBccyPYUu1uQHKtoJpMTouyyz82E8_Lmhc", // OTPDetail?.apikey,
          authDomain: "testfudme.firebaseapp.com",
        });
      } else {
        firebase.getApps()
      }
      const auth = getAuth();
      auth.languageCode='en'
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
          console.log("prepared phone auth process");
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      },auth);
      setTimeout(() => {
        recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        });
        $("#recaptcha-container").css('transform', 'scale(' + 0.77 + ')');
        $("#recaptcha-container").css('-webkit-transform', 'scale(' + 0.77 + ')');
        $("#recaptcha-container").css('transform-origin', '0 0');
        $("#recaptcha-container").css('-webkit-transform-origin', '0 0');
        $("#recaptcha-container #rc-anchor-container").css('width', '250px');
      }, 500);

    }
  }, [OTPDetail]);
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (restaurantinfo.smsapigateway === 1 && restaurantinfo.enableotpauthentication === true) {
      const auth = getAuth();
     signInWithPhoneNumber(auth, dialCode.toString() + values.phone, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      setIsShowReSend(true);
      handleNotify("OTP sent Successfully", ToasterPositions.TopRight, ToasterTypes.Success);
    }).catch((error) => {
      handleNotify(error.message, ToasterPositions.TopRight, ToasterTypes.Error);
    });
    }
    if (restaurantinfo.smsapigateway === 2 && restaurantinfo.enableotpauthentication === true) {
      RegisterServices.twilioSendCode(
        restaurantinfo.restaurantId,
        restaurantinfo.enableotpauthentication,
        restaurantinfo.smsapigateway,
        dialCode.toString() + values.phone
      ).then((response) => {
        if (response && response != null) {
          setIsShowReSend(true);
          handleNotify("OTP sent Successfully", ToasterPositions.TopRight, ToasterTypes.Success);
        }
      })
    }
  }

  const handleValidateOTP = (e) => {
    e.preventDefault();
    var code = values.otp;
    if (restaurantinfo.smsapigateway === 1 && restaurantinfo.enableotpauthentication === true) {
      confirmationResult.confirm(code).then((result) => {
        setValues({
          ...values,
          ["isVerifiedPhone"]: "true"
        });
        values.isVerifiedPhone="true";
        setIsShowReSend(false);
        handleNotify("Successfully verified", ToasterPositions.TopRight, ToasterTypes.Success);
      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        handleNotify(error.message, ToasterPositions.TopRight, ToasterTypes.Error);
      });
    }
    if (restaurantinfo.smsapigateway === 2 && restaurantinfo.enableotpauthentication === true) {
      RegisterServices.twilioVerifyCode(
        restaurantinfo.restaurantId,
        restaurantinfo.enableotpauthentication,
        restaurantinfo.smsapigateway,
        code,
        dialCode.toString() + values.phone
      ).then((response) => {
        if (response && response != null) {
          setIsShowReSend(true);
          if (response.Valid && response.Valid === true) {
            setValues({
              ...values,
              ["isVerifiedPhone"]: "true"
            });
            values.isVerifiedPhone="true";
            handleNotify("Successfully verified", ToasterPositions.TopRight, ToasterTypes.Success);
          }
          else{
            setValues({
              ...values,
              ["isVerifiedPhone"]: "false"
            });
            values.isVerifiedPhone="false";
            handleNotify("otp does not match", ToasterPositions.TopRight, ToasterTypes.Error);
          }
        }
      })
    }
  }

  const validateForm = (event) => {
    event.preventDefault();
    let validateemial = /\S+@\S+\.\S+/
    let errorsvalue = {};
    let valid = true;
    if (!values.phone) {
      errorsvalue.phone = UserDetailsErrormessage.PHONE_NO_ERROR;
    }
    if( values.phone && values.phone.length<10){
      errorsvalue.phone=UserDetailsErrormessage.PHONE_NO_LENGTH_ERROR;
    }
    if (!values.password) {
      errorsvalue.password = UserDetailsErrormessage.PASSWORD_ERROR;
    }
    if (!values.firstname) {
      errorsvalue.firstname = UserDetailsErrormessage.FIRST_NAME_ERROR;
    }
    if (!values.lastname) {
      errorsvalue.lastname = UserDetailsErrormessage.lAST_NAME_ERROR;
    }
    if (!values.email) {
      errorsvalue.email = UserDetailsErrormessage.EMAIL_ERROR;
    }
    if (values.email) {
      if (!validateemial.test(values.email)) {
        errorsvalue.email = UserDetailsErrormessage.EMAIL_VALID_ERROR;
      }
    }
    if (!values.confirmpassword) {
      errorsvalue.confirmpassword = UserDetailsErrormessage.CONFIRM_PASSWORD_ERROR;
    }
    if (values.confirmpassword) {
      if (!values.password) {
        errorsvalue.password = UserDetailsErrormessage.PASSWORD_ERROR;
      } else if (values.confirmpassword !== values.password) {
        errorsvalue.password = UserDetailsErrormessage.PASSWORD_MISMATCH_ERROR;
      }
    }
    setErrors(errorsvalue);
    if (
      (errorsvalue.firstname && errorsvalue.firstname.length > 0) ||
      (errorsvalue.lastname && errorsvalue.lastname.length > 0) ||
      (errorsvalue.phone && errorsvalue.phone.length > 0) ||
      (errorsvalue.password && errorsvalue.password.length > 0) ||
      (errorsvalue.confirmpassword && errorsvalue.confirmpassword.length > 0)
    ) {
      setisdisable(true)
      setIsSubmitted(true);
      return (valid = false);
    } else {
      setisdisable(false)
      return valid;
    }
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
                <Form className="customForm" onSubmit={handleSubmit} noValidate>
                  <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <hr />
                    <span className="or top">OR</span>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 col-xs-12"
                    style={{ marginBottom: "20px" }}
                  >
                    <input
                      style={{ marginBottom: "-1px" }}
                      className=""
                      type="text"
                      name="firstname"
                      value={values.firstname}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">First name</label>
                    {errors.firstname &&
                      errors.firstname.length > 0 &&
                      isSubmitted && (
                        <span className="error" style={{ paddingLeft: "20px" }}>
                          {errors.firstname}
                        </span>
                      )}
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 col-xs-12"
                    style={{ marginBottom: "20px" }}
                  >
                    <input
                      style={{ marginBottom: "-1px" }}
                      className
                      type="text"
                      name="lastname"
                      value={values.lastname}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Last name</label>
                    {errors.lastname &&
                      errors.lastname.length > 0 &&
                      isSubmitted && (
                        <span className="error" style={{ paddingLeft: "20px" }}>
                          {errors.lastname}
                        </span>
                      )}
                  </div>
                  <div
                    className="col-lg-12 col-sm-12 col-xs-12"
                    style={{ marginBottom: "20px" }}
                  >
                    <input
                      style={{ marginBottom: "-1px" }}
                      className
                      type="text"
                      name="email"
                      value={values.email}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Email</label>
                    {errors.email && errors.email.length > 0 && isSubmitted && (
                      <span className="error" style={{ paddingLeft: "20px" }}>
                        {errors.email}
                      </span>
                    )}
                  </div>
                  {restaurantinfo.smsapigateway !== 0 &&
                    <>
                      <div className="col-lg-2 col-sm-2 col-xs-6"
                        style={{ marginBottom: "20px" }}>
{/* https://codesandbox.io/s/frosty-waterfall-jhtxq?file=/src/index.js:972-1020 */}
                        <IntlTelInput
                                css={['intl-tel-input', 'form-control']}
                                utilsScript={'libphonenumber.js'}
                                value={dialCode ==="" ? "+1" : dialCode}
                                onSelectFlag={(num, country) => {
                                    console.log('onSelectFlag', country);
                                    setDialCode("+"+country.dialCode)
                                }}
                                placeholder=""
                                className="dialCode"
                                 format={false}
                                 autoFocus={false}
                                readonly={true}
                            />
                      </div>
                      <div className="col-lg-4 col-sm-4 col-xs-6"
                        style={{ marginBottom: "20px" }}>
                        <input
                          style={{ marginBottom: "-1px" }}
                          className
                          type="text"
                          name="phone"
                          value={values.phone}
                          onChange={handlechange}
                          required
                        />
                        <label className="formlabel">Phone</label>
                        {errors.phone && errors.phone.length > 0 && isSubmitted && (
                          <span className="error" style={{ paddingLeft: "20px" }}>
                            {errors.phone}
                          </span>
                        )}
                      </div>
                    </>}
                  {restaurantinfo.smsapigateway === 0 &&
                    <div
                      className="col-lg-8 col-sm-8 col-xs-12"
                      style={{ marginBottom: "20px" }}
                    >
                      <input
                        style={{ marginBottom: "-1px" }}
                        className
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handlechange}
                        onPaste={handlePaste}
                        required
                      />
                      <label className="formlabel">Phone</label>
                      {errors.phone && errors.phone.length > 0 && isSubmitted && (
                        <span className="error" style={{ paddingLeft: "20px" }}>
                          {errors.phone}
                        </span>
                      )}
                    </div>}
                  {(restaurantinfo.smsapigateway === 1 && restaurantinfo.enableotpauthentication === true) &&
                    <div className="col-lg-4 col-sm-4 col-xs-12">
                      <div className="login-text" style={{ width: "32% !important", border: "none !important" }} id="recaptcha-container"></div>
                    </div>
                    
                    }
                  {restaurantinfo.smsapigateway === 1 && restaurantinfo.enableotpauthentication === true &&
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <a
                        className="blue_btn orange_submit"
                        onClick={handleSendOTP}
                        style={{ marginTop: "15px" }}
                      >
                        {!IsShowReSend ? "Send OTP" : "ReSend OTP"}
                      </a>
                    </div>}
                  {restaurantinfo.smsapigateway === 2 &&  restaurantinfo.enableotpauthentication === true &&
                    <div className="col-lg-6 col-sm-6 col-xs-12">
                      <a
                        className="blue_btn font_18px blue_btn_porder orange_submit"
                        onClick={handleSendOTP}
                        style={{ marginTop: "15px" }}
                      >
                        {!IsShowReSend ? "Send OTP" : "ReSend OTP"}
                      </a>
                    </div>}
                  <div className="col-lg-12">
                    {restaurantinfo.smsapigateway !== 0 && restaurantinfo.enableotpauthentication === true &&
                      <div
                        className="col-lg-6 col-sm-6 col-xs-12"
                        style={{ marginBottom: "20px" }}
                      >
                        <input
                          style={{ marginBottom: "-1px", marginLeft: "-12px" }}
                          className
                          type="text"
                          placeholder="Enter Verification OTP"
                          name="otp"
                          value={values.otp}
                          onChange={handlechange}
                          required
                        />
                        <label className="formlabel" style={{ marginLeft: "-15px" }}>Enter Verification OTP</label>
                      </div>}
                    {restaurantinfo.smsapigateway !== 0 && restaurantinfo.enableotpauthentication === true &&
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <a
                          className="blue_btn font_18px blue_btn_porder orange_submit"
                          onClick={handleValidateOTP}
                          style={{ marginTop: "15px" }}
                        >
                          Validate OTP
                        </a>
                      </div>}
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 col-xs-12"
                    style={{ marginBottom: "20px" }}
                  >
                    <input
                      style={{ marginBottom: "-1px" }}
                      className
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Password</label>
                    {errors.password &&
                      errors.password.length > 0 &&
                      isSubmitted && (
                        <span className="error" style={{ paddingLeft: "20px" }}>
                          {errors.password}
                        </span>
                      )}
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 col-xs-12"
                    style={{ marginBottom: "20px" }}
                  >
                    <input
                      style={{ marginBottom: "-1px" }}
                      className
                      type="password"
                      placeholder="Re-enter password"
                      name="confirmpassword"
                      value={values.confirmpassword}
                      onChange={handlechange}
                      required
                    />
                    <label className="formlabel">Re-enter password</label>
                    {errors.confirmpassword &&
                      errors.confirmpassword &&
                      errors.confirmpassword.length > 0 &&
                      isSubmitted && (
                        <span className="error" style={{ paddingLeft: "20px" }}>
                          {errors.confirmpassword}
                        </span>
                      )}
                  </div>
                  {registerAddressdata && (
                    <AddressesListComponent
                      registerAddressdata={registerAddressdata}
                    />
                  )}
                  <div className="col-lg-12 text-center flush col-sm-12 col-xs-12">
                    <div className="col-lg-12 flush column-centered col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <a
                          className="light_orange_btn address_btn"
                          data-toggle="modal"
                          data-target="#myModalregisteraddress"
                          onClick={handleaddAddressPopup}
                        >
                          + Add address
                        </a>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <Custombutton
                          buttonText="Register"
                          buttonType="submit"
                          buttonclass="blue_btn font_18px blue_btn_porder orange_submit"
                          isDisable={isdisable}
                          disabledClass="blue_btn font_18px blue_btn_porder orange_submit_disabled"
                        />
                      </div>
                      <div
                        className="col-lg-5 column-centered col-sm-5 col-xs-12"
                        style={{ marginLeft: "95px", marginTop: "25px" }}
                      >
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
                  {showLogin === true && (
                    <LoginMainComponent restaurantinfo={restaurantinfo} />
                  )}
                  {addadresspopup === true && (
                    <AddAddress reloadAddressList={reloadAddressList} />
                  )}
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
