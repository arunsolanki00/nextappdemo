import React, { useEffect, useState } from 'react'
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import validate from './stripe-checkout.validationRules';
import { OrderServices } from '../../redux/order/order.services';
import {  deleteCartItemFromSessionId, emptycart, orderinstruction,  stripepaymentintentid,  updateCartItemCount } from '../../redux/cart/cart.action';
import { CartServices } from '../../redux/cart/cart.services';
import { Custombutton } from '../Common/button/custombutton';
import { characterValid, checkCardType, dateValidate, numberValidate } from '../helpers/validate';
import { useRouter } from 'next/router'
import {  setorderId } from '../../redux/order/order.action';
import { RestaurantsServices } from '../../redux/restaurants/restaurants.services';
import { restaurantsdetail } from '../../redux/restaurants/restaurants.action';
import { CartTypes } from '../../redux/cart/cart.types';
import { getLocationIdFromStorage } from '../Common/localstore';
import Image from 'next/image';
import stripimage from "../../public/images/strip.svg";
import card1 from "../../public/images/card-1.png";
import card2 from "../../public/images/card-2.png";
import card3 from "../../public/images/card-3.png";
import card4 from "../../public/images/card-4.png";
import cardi1 from "../../public/images/cardi-1.svg";
import cardi2 from "../../public/images/cardi-2.svg";
import cardi3 from "../../public/images/cardi-3.svg";
import cardi4 from "../../public/images/cardi-4.svg";

const StripeCheckoutComponent = (props) => {

    const { orderId, calculatedTotal, changeOnCheckout, cardShowMessage } = props;
    let sessionid = useSelector(({ session }) => session?.sessionid);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const rewardpoint = useSelector(({ cart }) => cart?.rewardpoints);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMesssage] = useState("");
    const [paymentintentid, setpaymentintentid] = useState('');
    const [countries, setcountries] = useState();
    const [selectedCountryId, setselectedCountryId] = useState(0);
    const [isDisabled, setisDisabled] = useState(true)
    let buttonName = `Pay $ ${calculatedTotal && calculatedTotal > 0 ? calculatedTotal.toFixed(2) : 0}`;
    const [buttonname, setbuttonname] = useState("")
    const [values, setValues] = useState({ email: "", cardnumber: "", expiremonthyear: "", cvv: "", cardname: "", zipcode: "", });
    const [isprocessing, setisprocessing] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { query: { dynamic,location }, } = router;
    const [cardType, setCardType] = useState(0);
    const [ischecked, setischecked] = useState(false)
    const [isOrdering, setIsOrdering] = useState(false);

    useEffect(() => {
        if (dynamic && dynamic !== undefined) {
            let restauranturl = dynamic.toLowerCase().toString().replace(/ /g, "-");
            let locationId = getLocationIdFromStorage();
            RestaurantsServices.getRestaurantsList(restauranturl, locationId).then(response => {
                if (response) {
                    let newselectedRestaurant = response[0];
                    if (newselectedRestaurant) {
                        dispatch(restaurantsdetail(newselectedRestaurant));
                    }
                    if (newselectedRestaurant.defaultLocation.isOrderingDisable === true)
                        router.push("/" + newselectedRestaurant.restaurantURL+"/"+location + "/restaurant-close");
                    else setIsOrdering(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        OrderServices.getAllCountry().then((response) => {
            if (response && response.result.countryList.length > 0) {

                console.log('response ' + response);
                setselectedCountryId(response.result.countryList[0].countryid);
                setcountries(response.result.countryList);
            }
        });
    }, []);

    useEffect(() => {
        if (restaurantinfo && userinfo) {
            CartServices.getstripepaymentintentid(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, orderId, userinfo.customerId, calculatedTotal)
                .then((response) => {
                    if (response) {
                        console.log("paymentIntentId: " + response.paymentIntentId);
                        setpaymentintentid(response.paymentIntentId);
                        dispatch(stripepaymentintentid(response.paymentIntentId));
                    }
                });
        }
    }, [orderId]);

    const submitStripeForm = (event) => {
        changeOnCheckout();
        setisDisabled(true)
        event.preventDefault();
        let errorsList = validate(values);
        setErrors(errorsList);
        if (Object.keys(errorsList).length === 0) {
            submitSuccess();
            setbuttonname("Processing...")
            setisprocessing(true);
            return;
        } else {
            setischecked(false)
        }
    };

    const submitSuccess = () => {
        let expiry = values.expiremonthyear.split('/')
        const addPaymentObj = {
            cardDetails: {
                restaurantId: restaurantinfo.restaurantId,
                locationId: restaurantinfo.defaultlocationId,
                paymentIntentId: paymentintentid,
                orderId: orderId,
                paymentMethodId: 2, //paymentMethodId,
                totalAmount: calculatedTotal,
                customerId: userinfo.customerId,
                cardname: values.cardname.trim(),
                emailId: values.email.trim(),
                cardnumber: values.cardnumber.trim(),
                expmonth: expiry[0].trim(),
                expyear: expiry[1].trim(),
                cvv: values.cvv.trim(),
                zipcode: values.zipcode,
                countryId: selectedCountryId, //values.country.trim(),
                cartsessionid: sessionid,
            },
        };
        submitData(addPaymentObj);
    }

    const submitData = async (addPaymentObj) => {
        if (addPaymentObj != undefined) {
            setSubmitting(true);
            await OrderServices.confirmStripePayment(addPaymentObj.cardDetails).then((responsedata) => {
                if (responsedata && responsedata.status === 1) {
                    setSubmitting(false);
                    deleteCartItemFromSessionId(addPaymentObj.cartsessionid, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId);
                    dispatch({ type: CartTypes.DELETE_CART_ITEM_FROM_SESSIONID, payload: null });
                    emptycart();
                    if (rewardpoint !== undefined) {
                        let rewardpoints = {
                            rewardvalue: rewardpoint.rewardvalue,
                            rewardamount: rewardpoint.rewardamount,
                            rewardPoint: rewardpoint.rewardPoint,
                            totalRewardPoints: rewardpoint.rewardPoint,
                            redeemPoint: 0,
                        };
                        dispatch({
                            type: CartTypes.SET_REWARD_POINT,
                            payload: rewardpoints,
                        });
                    }
                    setorderId("");
                    stripepaymentintentid("");
                    updateCartItemCount();
                    orderinstruction("");
                    dispatch({
                        type: CartTypes.EMPTY_ORDER_INFO,
                        payload: null,
                    });
                    return router.push("/" + restaurantinfo.restaurantURL+"/"+location+ "/orderconfirmation");
                } else {
                    setischecked(false)
                    setisDisabled(true);
                    setErrorMesssage(responsedata?.message && responsedata.message);
                    setisprocessing(false);
                    setbuttonname(`Pay $ ${calculatedTotal && calculatedTotal > 0 ? calculatedTotal.toFixed(2) : 0}`)
                }
            });
        }
    };

    const handleCheckbox = (event) => {
        if (event.currentTarget.checked) {
            setischecked(true)
            setisDisabled(false);
        }
        else {
            setischecked(false)
            setisDisabled(true);
        }
    }

    const handleCVVChange = (event) => {
        if (event.target.name === "cvv" && numberValidate(event.target.value) && event.target.value !== "" && event.target.value.length <= 3) {
            setValues((values) => ({
                ...values,
                [event.target.name]: event.target.value,
            }));
        } else if (!numberValidate(event.target.value) && event.target.value !== "") {
            setValues((values) => ({
                ...values,
                [event.target.name]: values.cvv === undefined || values.cvv === "" ? "" : values.cvv,
            }));
        } else if (event.target.value === "") {
            setValues((values) => ({
                ...values,
                [event.target.name]: event.target.value,
            }));
        }
        setErrors((errors) => ({
            ...errors,
            [event.target.name]: "",
        }));
    }

    const handleCardNumberPress = (event) => {
        let cardnumbercheck = values.cardnumber.replace(/\s+/g, '') + event.key.replace(/\s+/g, '');
        //remove charcter from card number
        if (event.key === 'Backspace') {
            values.cardnumber = values.cardnumber.slice(0, -1)
            setValues((values) => ({
                ...values,
                [event.target.name]: values.cardnumber,
            }));
            setCardType(0);
        } else if (cardnumbercheck.length <= 16) {
            let cardnumber = event.key.replace(/\s+/g, '');
            //number validate check
            if (numberValidate(cardnumber)) {
                values.cardnumber = values.cardnumber + cardnumber;
                //set card type                
                setCardType(checkCardType(values.cardnumber));
                //add space after 4 digits in card number
                if (cardnumbercheck.length % 4 === 0 && cardnumbercheck.length < 16) {
                    setValues((values) => ({
                        ...values,
                        [event.target.name]: values.cardnumber + " ",
                    }));
                } else {
                    setValues((values) => ({
                        ...values,
                        [event.target.name]: values.cardnumber,
                    }));
                }
                //remove error 
                setErrors((errors) => ({
                    ...errors,
                    [event.target.name]: "",
                }));
            }
        }
    }

    const handleExpiryChange = (event) => {
        if (event.key === "Backspace") {
            values.expiremonthyear = values.expiremonthyear.slice(0, -1)
            setValues((values) => ({
                ...values,
                [event.target.name]: values.expiremonthyear,
            }));
        } else {
            let expdate = values.expiremonthyear.replace('/', '').replace(/\s+/g, '') + event.key.replace(/\s+/g, '');
            if (dateValidate(expdate) === true && expdate.length <= 4) {
                setValues((values) => ({
                    ...values,
                    [event.target.name]: expdate.length < 2 ? expdate : expdate.length === 2 ? expdate + ' / ' : addString(expdate, 2, ' / ')
                }));
            }
            setErrors((errors) => ({
                ...errors,
                [event.target.name]: "",
            }));
        }
    }

    function addString(str, index, stringToAdd) {
        return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    }

    const handlePaymentChange = (event) => {
        if (event.target.value === "") {
            setValues((values) => ({
                ...values,
                [event.target.name]: "",
            }));
            return;
        } else if (event.target.name === "email" || event.target.name === "zipcode") {
            setValues((values) => ({
                ...values,
                [event.target.name]: event.target.value,
            }));
        } else if (event.target.name === "cardname" && characterValid(event.target.value)) {
            setValues((values) => ({
                ...values,
                [event.target.name]: event.target.value,
            }));
        }
        setErrors((errors) => ({
            ...errors,
            [event.target.name]: "",
        }));
    };

    return (
        <>
            {/* {order.isRedirectToCheckout === true && isOrdering === true && */}
            {isOrdering === true &&
                <form id="paymentform">
                    <div className="customForm" >
                        <div className="col-lg-12 cards text-center col-sm-12 col-xs-12">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12" style={{ height: "35px" }}>
                                {cardType === 1 && <span><Image src={card1} alt="" /></span>}
                                {cardType === 2 && <span><Image src={card2} alt="" /></span>}
                                {cardType === 3 && <span><Image src={card3} alt="" /></span>}
                                {cardType === 4 && <span><Image src={card4} alt="" /></span>}
                            </div>
                            <div className="col-lg-12 strip text-center col-sm-12 col-xs-12">
                                <a href="#"><Image src={stripimage} alt="" /></a>
                            </div>
                        </div>
                        {cardShowMessage ? <div className="col-lg-12 strip text-center col-sm-12 col-xs-12" style={{ height: "40px" }}>
                            <span style={{ fontSize: "21px" }} className="error"> Note: {cardShowMessage} </span>
                        </div>
                            :
                            <div className="col-lg-12 strip text-center col-sm-12 col-xs-12" ></div>}
                            {errorMessage && 
                            <div className="col-lg-12 strip text-center col-sm-12 col-xs-12" style={{ height: "40px" }}>
                            <span className="error" style={{ fontSize: "23px" }}> *{errorMessage}</span>
                            </div>}
                        <div className="col-lg-12 col-sm-12 col-xs-12 marginbottom_12">
                            <input className="marginbottom_0" type="text" placeholder="Email" required onChange={handlePaymentChange}
                                value={values.email}
                                name="email" />
                            <label className="formlabel">Email</label>
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12 ">
                            <label className="label-normal">Card information</label>
                        </div>
                        <div className="col-lg-12 normal-input-style col-sm-12 col-xs-12 marginbottom_12">
                            <input className="marginbottom_0" type="text" placeholder="1234 1234 1234 1234" required onKeyDown={handleCardNumberPress} value={values.cardnumber} name="cardnumber" />
                            {errors.cardnumber && <span className="error">{errors.cardnumber}</span>}
                            <div className="card-imgs">
                                {cardType === 1 && <span><Image src={cardi1} /></span>}
                                {cardType === 2 && <span><Image src={cardi2} /></span>}
                                {cardType === 3 && <span><Image src={cardi3} /></span>}
                                {cardType === 4 && <span><Image src={cardi4} /></span>}
                            </div>
                        </div>
                        <div className="col-lg-6 flush-right left-input-style col-sm-6 col-xs-6 marginbottom_12">
                            <input className="marginbottom_0" type="text" placeholder="MM / YY" required onKeyDown={handleExpiryChange} value={values.expiremonthyear} name="expiremonthyear" />
                            {errors.expiremonthyear && <span className="error">{errors.expiremonthyear}</span>}
                        </div>
                        <div className="col-lg-6 flush-left right-input-style col-sm-6 col-xs-6 marginbottom_12">
                            <input className="marginbottom_0" type="text" placeholder="CVC" required onChange={handleCVVChange} value={values.cvv} name="cvv" />
                            {errors.cvv && <span className="error">{errors.cvv}</span>}
                        </div>
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12  marginbottom_12" >

                            <input className="marginbottom_0" type="text" placeholder="Name on card" required onChange={handlePaymentChange} value={values.cardname} name="cardname" />
                            <label className="formlabel">Name on card</label>
                            {errors.cardname && <span className="error">{errors.cardname}</span>}
                        </div>
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12 marginbottom_12">
                            <input className="cardnumber marginbottom_0" type="text" placeholder="Zipcode" required onChange={handlePaymentChange} value={values.zipcode} name="zipcode" />
                            <label className="formlabel">Zip code</label>
                            {errors.zipcode && <span className="error">{errors.zipcode}</span>}
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <label className="label-normal">Country or region</label>
                            <select id="billingCountry" name="country" value={values.country} >
                                {countries && countries.map((option) => {
                                    return (
                                        <option key={Math.random()} value={option.countryid}>{option.countryname}</option>)
                                }
                                )}
                            </select>
                        </div>
                        <div className="col-lg-12 flush col-sm-12 col-xs-12 marginbottom_0">
                            <div className="col-lg-9 col-lg-offset-2 checkbox col-sm-10 col-xs-12">
                                <label>
                                    <input type="checkbox" checked={ischecked} onChange={handleCheckbox} /> Save my credit card <br />By checking this box, I agree to the terms and conditions
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-12 margin_top_30 text-center col-sm-12 col-xs-12">
                            <Custombutton buttonText={isprocessing ? "processing..." : buttonName} buttonType="button" isDisable={isDisabled} disabledClass="blue_btn blue_btn_porder size_32 customdisable" buttonclass="blue_btn blue_btn_porder size_32" buttonMethod={submitStripeForm} />
                        </div>
                    </div>
                </form>
            }
        </>
    )
}

export default StripeCheckoutComponent
