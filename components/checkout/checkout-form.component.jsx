import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { carttransactionid } from "../../redux/cart/cart.action";
import { useRouter } from 'next/router'
import Loader from "../Common/loader/loader.component";

const CARD_OPTIONS = {
    iconStyle: "default",
    hidePostalCode: true,
    style: {
        base: {
            iconColor: "#1B72CE",
            color: "#707070",
            fontWeight: 500,
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": {
                color: "#313830",
            },
            "::placeholder": {
                color: "#313830",
            },
        },
        invalid: {
            iconColor: "red",
            color: "red",
        },
    },
};

const CardField = ({ onChange }) => (
    <fieldset className="FormGroup">
        <div className="FormRow">
            <CardElement options={CARD_OPTIONS} onChange={onChange} />
        </div>
    </fieldset>
);

const Field = ({
    label,
    id,
    type,
    placeholder,
    required,
    value,
    onChange,
}) => (
    <div>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
        />
        <label className="formlabel">
            {label}
        </label>
    </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
    <button
        className={`blue_btn blue_btn_porder size_32`}
        type="submit"
    //disabled={processing || disabled}
    >
        {processing ? 'Processing...' : children}
    </button>
);

const ErrorMessage = ({ children }) => (
    <div className="ErrorMessage" role="alert">
        <svg width="16" height="16" viewBox="0 0 17 17">
            <path
                fill="#FFF"
                d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
            />
            <path
                fill="#6772e5"
                d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
            />
        </svg>
        {children}
    </div>
);

const ResetButton = ({ onClick }) => (
    <button type="button" className="ResetButton" onClick={onClick}>
        <svg width="32px" height="32px" viewBox="0 0 32 32">
            <path
                fill="#FFF"
                d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"
            />
        </svg>
    </button>
);

const CheckoutForm = () => {
    const dispatch = useDispatch();
    const router = useRouter()
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [loader, setloader] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [billingDetails, setBillingDetails] = useState({
        email: '',
        phone: '',
        name: '',
        address: {
            postal_code: ''
        }
    });

    let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    const handleNumberChange = (change) => {
        if (change != undefined)
            console.log('[change]', change);
    };
    const handleDateChange = (change) => {
        if (change != undefined)
            console.log('[change]', change);
    };
    const handleCVCChange = (change) => {
        if (change != undefined)
            console.log('[change]', change);
    };

    const handleSubmit = async (event) => {
        setloader(true);
        event.preventDefault();

        // setBillingDetails({
        //     firstname: event.target.firstname.value,
        //     lastname: event.target.lastname.value
        // });

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        if (error) {
            elements.getElement('card').focus();
            return;
        }

        if (cardComplete) {
            setProcessing(true);
        }

        const payload = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardNumberElement),
            card: elements.getElement(CardExpiryElement),
            card: elements.getElement(CardCvcElement),
            billing_details: {
                email: event.target.email.value,
                phone: event.target.phone.value,
                name: event.target.firstname.value + ' ' + event.target.lastname.value,
                address: {
                    postal_code: event.target.postalcode.value
                }
            },
        });

        setProcessing(false);

        if (payload.error) {
            setError(payload.error);
        } else {
            if (payload.paymentMethod.id != undefined) {
                dispatch(carttransactionid(payload.paymentMethod.id));
                setPaymentMethod(payload.paymentMethod);
                router.push("/" + restaurantinfo.restaurantURL + "/orderconfirmation");
            }
        }
    };

    useEffect(() => {
        if (loader === true) {
            const timer = setTimeout(() => {
                setloader(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [loader])

    const reset = () => {
        setError(null);
        setProcessing(false);
        setPaymentMethod(null);
        // setBillingDetails({
        //     email: '',
        //     phone: '',
        //     name: '',
        //     address
        // });
    };

    return paymentMethod ? (
        <div className="Result">
            <div className="ResultTitle" role="alert">
                Payment successful
        </div>
            <div className="ResultMessage">
                Thanks for trying Stripe Elements. No money was charged, but we
          generated a PaymentMethod: {paymentMethod.id}
            </div>
            <ResetButton onClick={reset} />
        </div>
    ) : (
            <>
                <form className="customForm" onSubmit={handleSubmit}>
                    <fieldset>
                        <div className="col-lg-12 cards text-center col-sm-12 col-xs-12">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <a><img src="/images/card-1.png" alt="" /></a>
                                <a><img src="/images/card-2.png" alt="" /></a>
                                <a><img src="/images/card-3.png" alt="" /></a>
                                <a><img src="/images/card-4.png" alt="" /></a>
                            </div>
                            <div className="col-lg-12 strip text-center col-sm-12 col-xs-12">
                                <a><img src="/images/strip.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <Field
                                label="Email"
                                id="email"
                                type="email"
                                required
                                name="email"
                                placeholder="Email"
                            />
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <label className="label-normal">Card information</label>
                        </div>
                        {/* <div className="col-lg-12 normal-input-style col-sm-12 col-xs-12">
                            <CardNumberElement
                                onChange={handleNumberChange}
                            />
                            <div className="card-imgs">
                                <a href="#"><img src="/images/cardi-1.svg" /></a>
                                <a href="#"><img src="/images/cardi-2.svg" /></a>
                                <a href="#"><img src="/images/cardi-3.svg" /></a>
                                <a href="#"><img src="/images/cardi-4.svg" /></a>
                            </div>
                        </div> */}
                        <div className="col-lg-6 flush-right left-input-style col-sm-6 col-xs-6">
                            <input className="" type="text" placeholder="MM / YY" required />
                        </div>
                        <div className="col-lg-6 flush-left right-input-style col-sm-6 col-xs-6">
                            <input className="" type="text" placeholder="CVC" required />
                            <div className="card-imgs">
                                <a href="#"><img class="cvc" src="/images/cvc.svg" /></a>
                            </div>
                        </div>
                        <div className="col-lg-12 normal-input-style col-sm-12 col-xs-12">
                            <div className="cardblock">
                                <CardNumberElement
                                    onChange={handleNumberChange}
                                />
                            </div>
                            <div className="card-imgs">
                                <a><img src="/images/cardi-1.svg" /></a>
                                <a><img src="/images/cardi-2.svg" /></a>
                                <a><img src="/images/cardi-3.svg" /></a>
                                <a><img src="/images/cardi-4.svg" /></a>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                            <Field
                                label="First name"
                                id="firstname"
                                type="text"
                                required
                                name="firstname"
                                placeholder="First name"
                            />
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                            <Field
                                label="Last name"
                                id="lastname"
                                type="text"
                                required
                                name="lastname"
                                placeholder="Last name"
                            />
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                            <Field
                                label="Phone"
                                id="phone"
                                type="text"
                                required
                                name="phone"
                                placeholder="Phone"
                            />
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                            <Field
                                label="Postal Code"
                                id="postalcode"
                                type="text"
                                required
                                name="postalcode"
                                placeholder="postalcode"
                            />
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12 formlabel">
                            <label>
                                Expiration date
                            </label>
                            <div className="FormGroup">
                                <CardExpiryElement
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12 formlabel">
                            <label>
                                CVC
                            </label>
                            <div className="FormGroup">
                                <CardCvcElement
                                    onChange={handleCVCChange}
                                />
                            </div>
                        </div>
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12 formlabel">
                            {/* <CardField
                                onChange={(e) => {
                                    setError(e.error);
                                    setCardComplete(e.complete);
                                }}
                            /> */}
                            {/* <input className="" type="text" placeholder="Card number" required />
                        <label className="formlabel">Card number</label> */}
                        </div>
                        <div className="col-lg-12 flush col-sm-12 col-xs-12">
                            <div className="col-lg-4 col-lg-offset-2 col-sm-5 col-xs-12">
                                {/* <input className="" type="text" placeholder="MM/YY" required />
                            <label className="formlabel">Expiry</label> */}
                            </div>
                            <div className="col-lg-4 col-sm-5 col-xs-12">
                                {/* <input className="" type="text" placeholder="Security code" required />
                            <label className="formlabel">Security code</label> */}
                            </div>
                            <div className="col-lg-2 tool col-sm-2 col-xs-12">
                                {/* <a href="#" data-toggle="tooltip" data-placement="right" title="3 numbers on the back"><img src="/images/cvv.svg" alt="" /></a> */}
                            </div>
                            <div className="col-lg-9 col-lg-offset-2 checkbox col-sm-10 col-xs-12">
                                {/* <label>
                                    <input type="checkbox" /> Save my credit card <br />By checking this box, I agree to the <a href="#"><u>terms and conditions</u></a>
                                </label> */}
                            </div>
                        </div>
                        {/* <div className="col-lg-12 margin_top_30 text-center col-sm-12 col-xs-12">
                        <a className="blue_btn blue_btn_porder size_32" href="#">Pay Now</a>
                    </div> */}
                        {error && <ErrorMessage>{error.message}</ErrorMessage>}
                        <div className="col-lg-12 margin_top_30 text-center col-sm-12 col-xs-12">
                            <SubmitButton
                                processing={processing}
                                error={error}
                                //disabled={!stripe}
                                children={"Pay Now"}
                            >
                                {/* <NumberFormat value={cartitems ? cartitems.OrderTotal : 0} displayType={'text'} thousandSeparator={true} prefix={'Pay $'} decimalScale={2} fixedDecimalScale={true} /> */}
                                {/* ${cartitems ? cartitems.OrderTotal : 0} */}
                            </SubmitButton>
                        </div>
                    </fieldset>
                </form>
            </>
        )

    if (loader === true)
        return (<Loader />)
};

export default CheckoutForm;