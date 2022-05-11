import Link from "next/link";
import React, { Component, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MemoizedRegisterHeaderLogoComponent } from "../Header/registerheaderlogo.component";
import Loader from "../Common/loader/loader.component";
import { useRouter } from "next/router";
import { ENDPOINTS } from "../config";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import handleNotify from "../helpers/toaster/toaster-notify";

function CreateNewPasswordForm() {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const router = useRouter();
    const { query: { dynamic }, } = router;

    const [status, setStatus] = useState(null);
    const id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    const [validEmailAddress, setValidEmailAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [password, setPassword] = useState("");
    const [trypassword, setTrypassword] = useState("");
    const passwordOnChange = (e) => {setPassword(e.target.value); setPasswordErrorMessage(""); setErrorMessage("") }
    const trypasswordOnChange = (e) => {setTrypassword(e.target.value); setConirmPasswordErrorMessage(""); setErrorMessage("")}
    const [errorMessage, setErrorMessage] = useState(null);

    const [emailIdErrorMessage, setEmailIdErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [conirmpasswordErrorMessage, setConirmPasswordErrorMessage] = useState("");

    const userResetPasswordValidToken = async (token) => {

        try {

            const request = await fetch(ENDPOINTS.RESET_PASSWORD_VALIDTOKEN, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    validtoken: token
                })
            });

            const response = await request.json();

            if (response.d.TokenIsValid)
                return response.d;
            return false;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        const fetchData = async () => {

            const getResponse = await userResetPasswordValidToken(id);
            if (getResponse && getResponse.TokenIsValid) {
                setValidEmailAddress(getResponse.ValidEmailAddress);
            }
            else {
                router.push("/" + dynamic + "/reset-failed");
            }
            setStatus(getResponse);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSubmitting(true);
        setErrorMessage("");

         
        let iserror=false;
        if(password.length===0)
        {
            setPasswordErrorMessage("Password must be required")
            iserror=true;
        }
         if(trypassword.length === 0)
        {
            setConirmPasswordErrorMessage("Confirm password must be required")
            iserror=true;
        }
        
        if(password!==trypassword){
            setErrorMessage("Password and confirm password not matched")
            iserror=true;
        }

        if(iserror===true)  return;

        const getResponse = await userResetPasswordValidToken(id);
        if (getResponse && getResponse.TokenIsValid) {
            const response = await handleResetPasswordRequest();

            if (response && response.ChangeSuccessfully) {
                handleNotify(response.PasswordMessage, ToasterPositions.BottomRight, ToasterTypes.Success);
                router.push("/" + dynamic + "/password-set");
            }
            else if (response && !response.ChangeSuccessfully) {
                setSubmitting(false);
                handleNotify(response.PasswordMessage, ToasterPositions.BottomRight, ToasterTypes.Error);
                return setErrorMessage(response.PasswordMessage);
            }
        }
        else {
            setSubmitting(false);
            handleNotify("Token is not valid , please request again", ToasterPositions.BottomRight, ToasterTypes.Error);
            return setErrorMessage("Token is not valid , please request again");
        }
        setSubmitting(false);
    }

    const handleResetPasswordRequest = async () => {
        const data = {
            emailId: validEmailAddress,
            password: password,
            validtoken: id,
            confirmpassword: trypassword,
            restaurantId: restaurantinfo.restaurantId
        };
        const response = await userResetPasswordRequest(data);
         
        return response.d;
    }

    const userResetPasswordRequest = async (items) => {
        const location = ENDPOINTS.RESET_PASSWORD;
        const settings = {
            method: "POST",
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(items),
        };

        try {
            const fetchResponse = await fetch(location, settings);
             ;
            if (fetchResponse.status === 200) {
                let response = await fetchResponse.json();
                return response;
            }
            else if (fetchResponse.status === 400) {
                handleNotify(fetchResponse.statusText, ToasterPositions.BottomRight, ToasterTypes.Error);
                return null;
            }
            else if (fetchResponse.status === 500) {
                handleNotify(fetchResponse.statusText, ToasterPositions.BottomRight, ToasterTypes.Error);
                return null;
            }
            else {
                handleNotify('Error while sending request', ToasterPositions.BottomRight, ToasterTypes.Error);
                return null;
            }
        } catch (e) {
            handleNotify('Error while sending request', ToasterPositions.BottomRight, ToasterTypes.Error);
            return null;
        }
    }

    if (status)
        return (
            <>
                <section id="pickup" className="cre-password">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                                <Link href="/[dynamic]" as={`/${restaurantinfo.restaurantURL}`}>
                                    <a className="size_24 weight_500 color_grey">
                                        {/* <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span>Back */}
                                    </a>
                                </Link>
                            </div>
                            <MemoizedRegisterHeaderLogoComponent />
                        </div>
                        <div className="row">
                            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
                            </div>
                            <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                <div className="col-lg-5 column-centered col-sm-8 col-xs-12">
                                    <div className="col-lg-12 bg-s col-sm-12 col-xs-12">
                                        <div className="row">
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <h2>Create a New Password</h2>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12 register tttp flush column-centered col-sm-12 col-xs-12">
                                                <form className="customForm">
                                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                                        <input
                                                            className=""
                                                            type="text"
                                                            placeholder="Email"
                                                            value={validEmailAddress}
                                                            disabled
                                                            required
                                                        />
                                                        {/* <label className="formlabel">Email</label> */}
                                                    </div>
                                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                                        <input
                                                            className=""
                                                            type={"password"}
                                                            placeholder="Password"
                                                            onChange={(e) => passwordOnChange(e)}
                                                            value={password}
                                                            autoComplete="off"
                                                            required
                                                        />
                                                        <label className="formlabel">Choose a new Password</label>
                                                        {passwordErrorMessage && <span className="color_red">{passwordErrorMessage}</span> }
                                                    </div>
                                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                                        <input
                                                            className=""
                                                            type={"password"}
                                                            placeholder="Re-enter password"
                                                            onChange={(e) => trypasswordOnChange(e)}
                                                            value={trypassword}
                                                            autoComplete="off"
                                                            required
                                                        />
                                                        <label className="formlabel">Confirm Password</label>
                                                        {conirmpasswordErrorMessage && <span className="color_red">{conirmpasswordErrorMessage}</span> }

                                                        {errorMessage && <span className="color_red">{errorMessage}</span> }
                                                    </div>
                                                    <div className="col-lg-12 text-center flush col-sm-12 col-xs-12">
                                                        <div className="col-lg-12 flush column-centered col-sm-12 col-xs-12">
                                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                                <button
                                                                    className="blue_btn font_18px blue_btn_porder orange_submit"
                                                                    type="submit"
                                                                    value=""
                                                                    onClick={handleSubmit}
                                                                >Continue</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    return <Loader />
}

export default CreateNewPasswordForm;