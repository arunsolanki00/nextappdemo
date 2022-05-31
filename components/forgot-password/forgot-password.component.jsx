import React, { Component, useState } from "react";
import { MemoizedRegisterHeaderLogoComponent } from "../Header/registerheaderlogo.component";
import Link from 'next/link';
import { useSelector } from "react-redux";
import { ENDPOINTS } from "../config";
import { useRouter } from "next/router";
import handleNotify from "../helpers/toaster/toaster-notify";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";

function ForgotPasswordForm() {
    const router = useRouter();
    const { query: { dynamic }, } = router;

    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    const [errorMessage, setErrorMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState();
    const [customerId, setCustomerId] = useState();
    const emailOnChange = (e) => setEmail(e.target.value);

    const validateEmailSyntax = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const userEmailExist = async (email) => {

        try {
            const request = await fetch(ENDPOINTS.USER_EXIST, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'                    
                },
                body: JSON.stringify({
                    emailid: email,
                    restaurantId: restaurantinfo.restaurantId
                })
            });

            const response = await request.json();
            return response;

        } catch (e) {
            return false;
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSubmitting(true);
        setErrorMessage("");
        let submissionEmail = email;

        const validEmailSyntax = validateEmailSyntax(submissionEmail);
        if (!validEmailSyntax) {
            setSubmitting(false);
            return setErrorMessage("Email must be in a valid format");
        }

        const emailExists = await userEmailExist(submissionEmail);
        setCustomerId(emailExists.d);

        if (emailExists.d > 0) {
            const reponse = await handleForgotPasswordRequest(emailExists.d);
            if (reponse === 1) {
                setSubmitting(false);
                router.push("/" + dynamic + "/password-help");
            }
            setSubmitting(false);
        }
        else {
            setSubmitting(false);
            setErrorMessage("That email doesn't exist");
        }
    };

    const handleForgotPasswordRequest = async (cid) => {
        const data = {
            emailid: email,
            restaurantId: restaurantinfo.restaurantId,
            requesturl: window.location.origin + "/" + dynamic + "/create-new-password",
            customerId: cid
        };
        return await userForgotPasswordRequest(data);
    }

    const userForgotPasswordRequest = async (items) => {
        const location = ENDPOINTS.FORGOT_PASSWORD;
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

            if (fetchResponse.status == 200) {
                handleNotify('Email sent successfully', ToasterPositions.TopRight, ToasterTypes.Success);
                return 1;
            }
            else if (fetchResponse.status === 204) {
                handleNotify(fetchResponse.statusText, ToasterPositions.TopRight, ToasterTypes.Warning);
                return 1;
            }
            else if (fetchResponse.status === 400) {
                handleNotify(fetchResponse.statusText, ToasterPositions.TopRight, ToasterTypes.Warning);
                return null;
            }
            else {
                handleNotify('Error while sending request', ToasterPositions.TopRight, ToasterTypes.Error);
                return null;
            }
        } catch (e) {
            handleNotify('Error while sending request', ToasterPositions.TopRight, ToasterTypes.Error);
            return null;
        }
    }

    return (
        <>
            <section id="pickup" className="cre-password">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                            <Link href="/[dynamic]" as={`/${restaurantinfo.restaurantURL}`}>
                                <a className="size_24 weight_500 color_grey">
                                    <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span>Back
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
                                <div className="col-lg-12 bg-s pa-set col-sm-12 col-xs-12">
                                    <div className="row">
                                        <div className="col-lg-12 col-sm-12 col-xs-12">
                                            <h2>Password Help?</h2>
                                            <p> Please enter your email address to reset password.</p>
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
                                                        onChange={(e) => emailOnChange(e)}
                                                        value={email}
                                                        required
                                                        style={{ marginBottom: "15px" }}
                                                    />
                                                    <label className="formlabel">Email</label>
                                                    {errorMessage && errorMessage.length > 0 && (
                                                        <span className="error" style={{ marginRight: "30px" }}>
                                                            {errorMessage}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-lg-12 text-center flush col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 flush column-centered col-sm-12 col-xs-12">
                                                        <div className="col-lg-12 col-sm-12 col-xs-12">
                                                            <button
                                                                className="blue_btn font_18px blue_btn_porder orange_submit"
                                                                type="submit"
                                                                onClick={handleSubmit}
                                                            >Continue
                                                            </button>
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
}

export default ForgotPasswordForm;