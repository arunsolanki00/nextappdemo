import React, { Component, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector, useDispatch, shallowEqual, connect } from "react-redux";
import { LoginServices } from "../../redux/login/login.services";
import { LoginTypes } from "../../redux/login/login.types";
import { useRouter } from 'next/router'
import { getLoginUserDetails } from "../../redux/login/login.action";
import Link from "next/link";
import { restaurantsdetail } from "../../redux/restaurants/restaurants.action";
import { CartTypes } from "../../redux/cart/cart.types";
import { CustomInputButton } from "../Common/button/custominputbutton";
import { initialrewardpoint } from "../../redux/cart/cart.action";

const LoginMainComponent = (props) => {
  const { restaurantinfo } = props;
  const dispatch = useDispatch();
  const router = useRouter()
  const { query: { dynamic,location ,id, category, items } } = router;
  const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery);
  const selecteddeliveryaddress = selecteddelivery.selecteddeliveryaddress;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorusername, setErrorUsername] = useState("");
  const [errorpassword, setErrorPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isdisable, setisdisable] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const usernameOnChange = (e) => {
    let regex1 = /(\(?\d{1,2})/;
    let regex2 = /^(\(?\d{1,})\)?(\d{1,}?)(\-?\d{1,})$/;
    let regex3 = /^\($/;
    let validdigit = /^\d{1,}$/;
    let phoneno = e.target.value.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');

    if (phoneno.length > 11)
      return;
    if (phoneno === "")
      setUsername(e.target.value);
    if ((regex1.test(phoneno) || regex2.test(phoneno) || (regex3.test(phoneno))) && validdigit.test(phoneno)) {
      setSubmitting(false)
      setUsername(e.target.value);
      if (username.length === 9) {
        setUsername(e.target.value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"));
      }
      if (phoneno.length < 10) {
        setUsername(e.target.value.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''));
      }
      setErrorUsername("");
      setErrorMessage("");
      return;
    }
    else {
      return false;
    }
    return;
  }

  const passwordOnChange = (e) => {
    setSubmitting(false)
    setPassword(e.target.value);
    setErrorPassword("");
    setErrorMessage("");
  }

  const ClearForm = () => {
    setUsername("");
    setPassword("");
    setErrorUsername("");
    setErrorPassword("");
    setErrorMessage("");
    return;
  }
  const CloseAddress = () => {
    ClearForm();
    let loginpopupclose = document.getElementById("loginpopupclose");
    if (loginpopupclose) {
      loginpopupclose.click();
    }
    $('.modal-backdrop').remove();
  }

  const handleLogin = () => {
    $('.modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    router.push("/" + restaurantinfo.restaurantURL +"/"+location+ "/register");
  }

  const handleForgotPassword = () => {
    $('.modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    router.push("/" + restaurantinfo.restaurantURL+"/"+location + "/forgot-password");
  }

  const handlePaste = (e) => {
    let pastedValue = e.clipboardData.getData("text")
    if (Number(pastedValue)) {
      console.log("onpaste event call")
      if (pastedValue.length > 8) {
        console.log(e.target.value)
        e.target.value = pastedValue;
        console.log(e.target.value)
        let valuephone = "";
        valuephone = e.target.value
        let replacedvalue = valuephone.replace(/(\d{3})(\d{3})(\d{3})/, "($1) $2-$3");
        setUsername(replacedvalue)
      }
    }
    else {
      return;
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    var restaurantId = restaurantinfo.restaurantId;
    if (validateForm(evt)) {
      let formatedusername = username.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
      let usernames = username.replace(/(\(\d{3}\))(\s\d{3})(\-\d{4})/, formatedusername);
      setisdisable(true)
      LoginServices.getLoginUserDetails(usernames, password, restaurantId).then(responsedata => {
        if (responsedata !== null && responsedata.customerDetails !== null && responsedata.customerDetails !== undefined) {
          console.log("login success");
          dispatch({
            type: LoginTypes.USER_DETAIL,
            payload: responsedata.customerDetails,
          });
          if (responsedata.customerDetails) {
            dispatch(initialrewardpoint(responsedata.customerDetails));
          }
          let url = window.location.href;
          if (url.includes("pickupconfirmation") || (url.includes("deliveryconfirmation") && selecteddeliveryaddress !== null)) {
            router.push("/" + restaurantinfo.restaurantURL +"/"+location+ "/cart");
          }
          if (url.includes("register")) {
            router.push("/" + restaurantinfo.restaurantURL +"/"+location+"/pickup");
          }
          CloseAddress();
        } else {
          setSubmitting(true)
          setisdisable(false)
          setSubmitting(true)
          setErrorMessage("The username or password is incorrect");
        }
      })
    } else {
      console.log("Invalid Form");
    }
  };

  const validateForm = (event) => {
    event.preventDefault();
    let iserror = false;
    if (!username) {
      setErrorUsername("Username must be required");
      iserror = true;
    }
    if (!password) {
      setErrorPassword("Password must be required");
      iserror = true;
    }
    if (iserror) {
      setSubmitting(true)
      return false;
    } else {
      return true;
    }
  }
  return (
    <>
      <div id="myModal-logintest" className="modal fade" role="dialog" >
        <div className="modal-dialog">
          {/* Modal content*/}
          <div className="modal-content">
            <div className="modal-body">
              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <button type="button" className="close" data-dismiss="modal" id="loginpopupclose" onClick={() => CloseAddress()}>
                  <img src="/images/close.svg" alt="" />
                </button>
                <h3 style={{ fontWeight: "600", fontSize: "26px" }}>Login</h3>
              </div>
              <div className="col-lg-9 column-centered text-center col-sm-11 col-xs-12">
                <form className="customForm">
                  <div className="col-lg-12 col-sm-12 col-xs-12">
                    <input
                      type="text"
                      placeholder="Phone"
                      name="phone"
                      required
                      value={username}
                      onChange={(e) => usernameOnChange(e)}
                      onPaste={handlePaste}
                      noValidate
                      autoComplete="off"
                    />
                    <label className="formlabel">Phone</label>

                    {errorusername.length > 0 && (
                      <span className="error">{errorusername}</span>
                    )}
                  </div>
                  <div className="col-lg-12 col-sm-12 col-xs-12" id="loginPagePassword">
                    <input
                      type={showPassword === false ? "password" : "text"}
                      placeholder="Password"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => passwordOnChange(e)}
                      noValidate
                    />
                    <label className="formlabel">Password</label>
                    <i className={showPassword === false ? "fa fa-eye-slash fa-lg" : "fa fa-eye fa-lg"} id="togglePassword" onClick={(e) => setShowPassword(!showPassword)}></i>
                    {errorpassword.length > 0 && (
                      <span className="error">{errorpassword}</span>
                    )}

                  </div>
                  <div className="col-lg-12 col-sm-12 col-xs-12">
                    {errorMessage.length > 0 && (
                      <span className="error">{errorMessage}</span>
                    )}
                    {
                      isdisable ? <CustomInputButton buttonText="Processing..." buttonType="submit" buttonClass="orange_btn_submit" buttonMethod={handleSubmit} isDisable={true} disabledClass="orange_submit_disabled color_white" />
                        : <CustomInputButton buttonText="Login" buttonType="submit" buttonClass="orange_btn_submit" buttonMethod={handleSubmit} isDisable={submitting} disabledClass="orange_submit_disabled color_white" />
                    }
                  </div>
                  <div className="col-lg-12 col-sm-12 col-xs-12">
                    <a className="forg" onClick={handleForgotPassword}>Forgot password?</a>
                    {/* <Link href="/[dynamic]/register" as={`/${restaurantinfo.restaurantURL}/register`}  onClick={handleLogin}>
                    <a className="regi" >Register</a>
                  </Link> */}
                    <a className="orange_btn_submit" onClick={handleLogin} >Register</a>
                  </div>

                </form>
                {/* {submitting && (<>
                  Loadding.........
                </>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginMainComponent;
