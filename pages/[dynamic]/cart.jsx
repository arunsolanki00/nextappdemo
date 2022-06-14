import Head from "next/head";
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { MemoizedCartCounterComponent } from "../../components/Header/cart-counter.component";
import DeliveryDropdownComponent from "../../components/Header/delivery-dropdown.component";
import LeftMenuComponent from "../../components/LeftMenu/leftmenu.component";
import CartRewardPoint from "../../components/ShoppingCart/cart-reward-point";
import ShoppingCartItem from "../../components/ShoppingCart/shopping-cart-item";
import {
  getCartItem,
  carttotaldata,
  updatecarttotaldata,
  deliverycharges,
  orderinstruction,
  getCartItemCount
} from "../../redux/cart/cart.action";
import DeliveryCharges from "../../components/ShoppingCart/delivery-charges.component";
import Link from "next/link";
import SmallLoader from "../../components/Common/small-loader.component";
import { MemoizedMenuItemHeaderLogoComponent } from "../../components/Header/menuitemheaderlogo.component";
import { CartMessage } from "../../components/helpers/static-message/cart-message";
import { GetCurrency } from "../../components/helpers/utility";
import { restaurantsdetail } from "../../redux/restaurants/restaurants.action";
import { RestaurantsServices } from "../../redux/restaurants/restaurants.services";
import { getLocationIdFromStorage } from "../../components/Common/localstore";
import NoItemsCartComponent from "../../components/ShoppingCart/no-items-cart.component";
import GeoFancingDeliveryCharges from "../../components/ShoppingCart/geo-fancing-delivery-charges.component";
import { CartTypes } from "../../redux/cart/cart.types";
import { CartloginComponent } from "../../components/cart-login/cart-login";
import { setordertime } from "../../redux/order/order.action";
import { OrderServices } from "../../redux/order/order.services";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    query: { dynamic },
  } = router;
  let restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail
  );
  const location = restaurantinfo.defaultLocation;
  const userinfo = useSelector(
    ({ userdetail }) => userdetail.loggedinuser,
    shallowEqual
  );
  let customerId = userinfo ? userinfo.customerId : 0;
  let cart = useSelector(({ cart }) => cart);
  let carttotal = cart?.carttotal && cart.carttotal;
  let promotionData = carttotal?.PromotionData && carttotal.PromotionData;
  let cartdata = cart?.cartitemdetail && cart?.cartitemdetail;
  let rewardpoint = cart?.rewardpoints && cart.rewardpoints;
  // let cartsessionId = restaurantinfo && userinfo && getSessionKey(restaurantinfo.restaurantId, userinfo && userinfo.customerId, restaurantinfo.defaultlocationId);
  let sessionid = useSelector(({ session }) => session?.sessionid);
  let objrestaurant = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
  const { restaurantURL } = objrestaurant;
  let isGeoFancing = location && location.locationId === restaurantinfo.defaultlocationId ? location.isGeoFencing : false;

  const pickupordelivery = useSelector(
    ({ selecteddelivery }) => selecteddelivery.pickupordelivery
  );
  const deliveryaddressinfo = useSelector(
    ({ selecteddelivery }) => selecteddelivery.selecteddeliveryaddress
  );

  let cartTaxList = carttotal?.cartTaxList && carttotal.cartTaxList;
  const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery);
  const ordertype = selecteddelivery.pickupordelivery === "Pickup" ? 1 : 2;
  const [tipdata, settipdata] = useState([
    { id: 1, value: false, text: "10" },
    { id: 2, value: false, text: "15" },
    { id: 3, value: false, text: "20" },
  ]);
  const [tipdatanew, settipdatanew] = useState([]);
  const [tipvalue, settipvalue] = useState(carttotal?.totalTip && carttotal.totalTip.toFixed(2));
  const [grandtotal, setgrandtotal] = useState(carttotal?.grandTotal != undefined ? parseFloat(carttotal.grandTotal) : 0);
  const [tipamount, settipamount] = useState(carttotal?.totalTip && carttotal?.totalTip > 0 ? carttotal?.totalTip.toFixed(2) : 0);
  const [specialinstructions, setspecialinstructions] = useState(cart?.orderinstruction && cart.orderinstruction == "" ? "" : cart.orderinstruction);
  const [loader, setloader] = useState(false);
  const [tipPercent, settipPercent] = useState(parseFloat(carttotal?.tipPercentage) > 0 ? parseFloat(carttotal.tipPercentage) : '');
  const [discountAmount, setdiscountAmount] = useState(0);
  const [discountPercent, setdiscountPercent] = useState(0);
  const [isPayActive, setisPayActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisableOrder, setIsDisableOrder] = useState(true)
  const [currency, setcurrency] = useState(GetCurrency());
  const [isOrdering, setIsOrdering] = useState(false);
  let minimumdeliveryorder = restaurantinfo.defaultLocation ? restaurantinfo.defaultLocation?.minimumdeliveryorder : 0;
  let minimumtakeoutorder = restaurantinfo.defaultLocation ? restaurantinfo.defaultLocation?.minimumtakeoutorder : 0;
  let dcharges =
    cart &&
    pickupordelivery === "Delivery" &&
    cart.carttotal != undefined &&
    cart.carttotal?.deliveryCharges &&
    JSON.parse(cart.carttotal?.deliveryCharges);
  let dtotal =
    dcharges != undefined &&
    pickupordelivery === "Delivery" &&
    dcharges?.DeliveryCharges &&
    parseFloat(dcharges.DeliveryCharges);

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
            router.push("/" + newselectedRestaurant.restaurantURL + "/restaurant-close");
          else if (pickupordelivery && pickupordelivery === "Pickup" && location.isTakeoutOrderingDisable === true)
            router.push("/" + newselectedRestaurant.restaurantURL + "/restaurant-close");
          else if (pickupordelivery && pickupordelivery === "Delivery" && location.isDeliveryOrderingDisable === true)
            router.push("/" + newselectedRestaurant.restaurantURL + "/restaurant-close");
          else setIsOrdering(true);
        }
      });
    }
    if (loader === true) {
      const timer = setTimeout(() => {
        setloader(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loader]);


  useEffect(() => {
    // if (userinfo != undefined && userinfo != null) {
    {
      if (pickupordelivery && pickupordelivery === "Delivery")
        dispatch(deliverycharges(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, isGeoFancing))
      else {
        dispatch({
          type: CartTypes.EMPTY_DELIVERY_CHARGES,
          payload: null
        });
      }
    };
    // if(rewardpoint){
    let rpoint = 0;
    let ramount = 0;
    if (rewardpoint?.redeemPoint) {
      rpoint = rewardpoint.redeemPoint > 0 ? rewardpoint.redeemPoint : 0;
    }
    if (rewardpoint?.rewardvalue && rpoint > 0) {
      ramount = rpoint / rewardpoint.rewardvalue;
    }
    if (sessionid !== null) {
      dispatch(getCartItem(
        sessionid,
        restaurantinfo.defaultlocationId,
        restaurantinfo.restaurantId,
        0,
        customerId,
        rpoint,
        ramount,
        deliveryaddressinfo && pickupordelivery === "Delivery"
          ? deliveryaddressinfo.deliveryaddressId
          : 0,
        tipPercent,
        tipamount
      )
      );
      dispatch(getCartItemCount(sessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, userinfo?.customerId ? userinfo.customerId : 0));
    }

    // }

    if (carttotal != undefined && carttotal != null) {

      if (
        carttotal?.tipPercentage !== undefined &&
        carttotal?.tipPercentage > 0
      ) {
        let data = [];
        tipdata.forEach((element) => {

          if (parseFloat(element.text) == carttotal.tipPercentage) {
            element.value = true;
            data.push(element);
            settipdatanew(data);
            let tipamountcal = calculateTip(
              element.text,
              carttotal.subTotal
            );
            settipamount(tipamountcal);
          } else {
            data.push(element);
            settipdatanew(data);
          }
        });
      }
      else {
        let data = [];
        tipdata.forEach((element) => {

          if (parseFloat(element.text) === 15) {
            element.value = true;
            data.push(element);
            settipdatanew(data);
            let tipamountcal = calculateTip(
              element.text,
              carttotal.subTotal
            );
            settipamount(tipamountcal);
            dispatch(
              carttotaldata(sessionid,
                restaurantinfo.defaultlocationId,
                restaurantinfo.restaurantId,
                customerId,
                0,
                carttotal.reedemPoints,
                carttotal.reedemAmount,
                parseInt(element.text),
                tipamountcal,
                deliveryaddressinfo && pickupordelivery === "Delivery"
                  ? deliveryaddressinfo.deliveryaddressId
                  : 0
              )
            );
            settipvalue(tipamountcal)
          } else {
            //settipdatanew.push(element)
            data.push(element);
            settipdatanew(data);
          }
        });

      }

    }
  }, [carttotal?.grandTotal, grandtotal || grandtotal]);

  useEffect(() => {
    if (carttotal != undefined && carttotal.grandTotal != undefined) {
      setdiscountPercent(parseFloat(carttotal.discountPercentage).toFixed(2));
      setdiscountAmount(carttotal.discountAmount);
      setgrandtotal(carttotal.grandTotal);
      //tip update on grand total update
      let tamount = 0;
      if (tipPercent) {
        tamount = calculateTip(tipPercent, carttotal.subTotal);
        settipamount(tamount);
        settipvalue(tamount);
      }
    }
  }, [carttotal && carttotal?.grandTotal > 0 && carttotal?.grandTotal]);

  useEffect(() => {
    if (Object.keys(cartdata).length === 0) {
      dispatch(updatecarttotaldata());
    }
  }, [cartdata, cart.cartitemcount])

  const addtipclick = (item) => {

    let updatetip = [];
    if (item != undefined) {
      settipPercent(item.text);

      tipdata.map((data) => {
        if (data.id === item.id && item.value === true) data.value = false;
        else if (data.id === item.id && item.value === false) data.value = true;
        else if (data.id !== item.id) data.value = false;

        updatetip.push(data);
      });
      settipdata(updatetip);

      let selectedtip = tipdata.find((x) => x.value === true);
      if (selectedtip != undefined && parseInt(selectedtip.text) > 0) {
        let tipamount = calculateTip(
          selectedtip.text,
          carttotal.subTotal
        ); //parseInt(selectedtip.text) * parseFloat(carttotal.subTotalWithDiscount) / 100;
        settipamount(tipamount);
        settipvalue(parseFloat(tipamount));
        updatecart(selectedtip.text, tipamount);
      } else {
        settipvalue(0);
        settipamount(0);
        setgrandtotal(parseFloat(carttotal.grandTotal.toFixed(2)));
        updatecart(0, 0);
      }
    }
  };

  //CALCULATE THE TIP AMOUNT
  function calculateTip(selectedtip, subtotal) {
    let tipamount = 0;
    if (selectedtip > 0 && subtotal > 0) {
      tipamount = (parseInt(selectedtip) * parseFloat(subtotal)) / 100;
      return tipamount.toFixed(2);
    } else {
      return tipamount;
    }
  }

  const updatecart = (caltippercent, caltipamount) => {
    settipPercent(caltippercent);

    dispatch(
      carttotaldata(
        sessionid,
        restaurantinfo.defaultlocationId,
        restaurantinfo.restaurantId,
        customerId,
        0,
        carttotal.reedemPoints,
        carttotal.reedemAmount,
        caltippercent,
        caltipamount,// tipamount,
        deliveryaddressinfo && pickupordelivery === "Delivery"
          ? deliveryaddressinfo.deliveryaddressId
          : 0
      )
    );
  };
  const handlePaymentActive = () => {

    if (order.checktime.includes('AM') || order.checktime.includes('PM')) {
      let otime = order.checktime.split(' ');
      OrderServices.checkOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, otime[0], otime[1], ordertype)
        .then((response) => {
          if (response.result != undefined && response.result !== null) {
            if (response.result.status === 'fail' || response.result.status === 'error') {
              setordertimeerrormessage(response.result.message);
              dispatch(setordertime(""));
              setIsDisableOrder(true);
            }
            if (response.result.status === 'success') {
              setIsDisableOrder(false);
              setisPayActive(true);
            }
          }
        });
    }
  }
  const onchangetipamount = (item) => {

    const pattern = new RegExp(/^[0-9]*(\.\d{0,2})*$/);
    if (pattern.test(item.target.value) || item.target.value === "") {
      let tvalue = item.target.value != "" ? item.target.value : "";
      let updatetip = [];
      if (tvalue != undefined) {
        tipdata.map((data) => {
          data.value = false;
          updatetip.push(data);
        });

        settipamount(tvalue);
        settipPercent(0);
        settipdata(updatetip);
        settipvalue(tvalue != "" ? parseFloat(tvalue).toFixed(2) : 0);
        dispatch(
          carttotaldata(
            sessionid,
            restaurantinfo.defaultlocationId,
            restaurantinfo.restaurantId,
            customerId,
            0,
            carttotal.reedemPoints,
            carttotal.reedemAmount,
            0,
            tvalue,
            deliveryaddressinfo && pickupordelivery === "Delivery"
              ? deliveryaddressinfo.deliveryaddressId
              : 0
          )
        );
        setgrandtotal(parseFloat(carttotal.grandTotal.toFixed(2)));
      }
    }
  };

  const DisplayMinimumOrderDelivery = () => {

    if (pickupordelivery === "Pickup") {
      if (carttotal.subTotal >= minimumtakeoutorder) {
        return (

          <Link href={`/${restaurantinfo.restaurantURL}/choosepayment`} as={`/${restaurantURL}/choosepayment`}>
            <a className="blue_btn"> Checkout {loader === true &&
              (<SmallLoader />)}
            </a>
          </Link>
        )
      } else {
        return (
          <>
            <a className="blue_btn" style={{ backgroundColor: "darkgrey" }} > Checkout </a>
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <h3 className="margin_top_20 margin_bottom_20">
                <span className="color_orange size_24 float_right weight_300">
                  <> {`Minimum order for Takeout is ${currency} ${minimumtakeoutorder.toFixed(2)}`} </>
                </span>
              </h3>
            </div>
          </>
        )
      }
    }
    if (pickupordelivery === "Delivery") {
      if (carttotal.subTotal >= minimumdeliveryorder) {
        return (
          <Link href={`/${restaurantinfo.restaurantURL}/choosepayment`}>
            <a className="blue_btn"> Checkout {loader === true &&
              (<SmallLoader />)}
            </a>
          </Link>
        )
      } else {
        return (
          <>
            <a className="blue_btn" style={{ backgroundColor: "darkgrey" }} > Checkout </a>
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <h3 className="margin_top_20 margin_bottom_20">
                <span className="color_orange size_24 float_right weight_300">
                  <> {`Minimum order for delivery is ${currency} ${minimumdeliveryorder.toFixed(2)}`} </>
                </span>
              </h3>
            </div>
          </>
        )
      }
    }
  }

  const onchangespecialinstructions = (item) => {
    if (item != undefined) {
      let data = item.target.value;
      setspecialinstructions(data);
      dispatch(orderinstruction(data));
    }
  }
  useEffect(() => {
    if (
      pickupordelivery === "Delivery" &&
      deliveryaddressinfo &&
      deliveryaddressinfo.length === 0 && carttotal?.cartCount > 0
    ) {
      setErrorMessage("Please select delivery address.");
    } else if (
      dcharges &&
      dcharges.isdelivery === 0 &&
      dcharges.chargeType === "3" &&
      dcharges.minOrderForAddress !== "0" &&
      carttotal?.cartCount > 0
    ) {
      setErrorMessage(
        "Minimum order value for delivery at your address is " +
        carttotal.currencySymbol +
        " " +
        dcharges.minOrderForAddress +
        " before tax. Please add some more items."
      );
    } else if (dcharges && dcharges.isdelivery === 0 && carttotal?.cartCount > 0) {
      setErrorMessage(
        "Sorry ! We do not deliver above " + dcharges.maxkms + " KM."
      );
    } else if (
      dcharges &&
      dcharges.minOrderForAddress > cart.carttotal.subTotal && carttotal?.cartCount > 0 &&
      cartdata?.cartDetails?.cartItemDetails != undefined &&
      cartdata?.cartDetails?.cartItemDetails?.length > 0
    ) {
      setErrorMessage(
        "Minimum order value for delivery is " +
        carttotal.currencySymbol +
        " " +
        dcharges.minOrderForAddress +
        " before tax. Please add some more items."
      );
    } else {
      setErrorMessage("");
    }
  }, [dcharges, cart, deliveryaddressinfo, userinfo, carttotal]);
  const calulateTotal = () => {
    let total = 0;
    cartdata?.cartDetails?.cartItemDetails?.map(data => {
      total += data.totalprice;
    })
    return total.toFixed(2);
  }
  const itemstotal = calulateTotal();
  // if (cartdata != undefined && userinfo != undefined && userinfo != null && carttotal != null && carttotal.grandTotal != undefined && isOrdering === true) {
  if (userinfo != undefined && userinfo != null) {
    return (
      <>
        <div>
          <Head>
            <title>
              Review Cart | {restaurantinfo.restaurantname}: Online Ordering
            </title>
            <meta name="description" content="Online description" />
          </Head>
          <div className="container-fluid">
            <div className="row row-eq-height">
              <LeftMenuComponent />
              <div className="col-lg-9 pull-right p-2 right-content col-sm-9 col-xs-12">

                <div className="row">
                  <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                    <div className="col-lg-4 left-a col-sm-12 col-xs-12">
                      <Link
                        shallow={false}
                        key={Math.random()}
                        href="/[dynamic]/main"
                        as={`/${dynamic}/main`}
                      >
                        <a className="size_24 weight_500 color_grey">
                          <span className="bg_grey">
                            <img src="/images/arrow-left.svg" />
                            {/* <Image src="/images/arrow-left.svg"  layout="fill" /> */}
                            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
                          </span>{" "}
                          Back
                        </a>
                      </Link>
                    </div>
                    <MemoizedMenuItemHeaderLogoComponent />
                    <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                      <DeliveryDropdownComponent />
                      <MemoizedCartCounterComponent />
                    </div>
                  </div>
                </div>

                {errorMessage !== "" && (
                  <div className="row">
                    <div className="col-lg-12 h1-margin col-sm-12 col-xs-12 small-text-center">
                      <span
                        className="ora"
                        style={{
                          backgroundColor: "red",
                          fontSize: "21px",
                          width: "inherit",
                        }}
                      >
                        {errorMessage}
                      </span>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-12 h1-margin col-sm-12 col-xs-12 small-text-center">
                    <h1 className="margin_top_0px">Cart</h1>
                  </div>
                </div>
                {cartdata != undefined &&
                  cartdata !== null &&
                  carttotal?.cartCount > 0 &&
                  cartdata?.cartDetails != undefined &&
                  cartdata?.cartDetails?.cartItemDetails != undefined &&
                  cartdata?.cartDetails?.cartItemDetails?.length > 0 && isOrdering === true &&
                  (
                    <div className="row">
                      <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
                        <div className="row">
                          <div className="col-lg-8 space-right col-sm-12 col-xs-12">
                            <ShoppingCartItem cartdata={cartdata} />
                          </div>
                          <div className="col-lg-4 rt-s flush xsnoflush col-sm-12 col-xs-12">
                            {userinfo != undefined && userinfo != null && (
                              <div>
                                <CartRewardPoint />
                              </div>
                            )}
                            <div className="col-lg-12 spe_btn col-sm-12 col-xs-12 checkout">
                              <div className="box margin_top_30">
                                <h3>{CartMessage.SPECIALS_INSTRUCTIONS}</h3>
                                <div className="customForm">
                                  <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                    <textarea
                                      placeholder="Message"
                                      value={specialinstructions}
                                      onChange={(e) =>
                                        onchangespecialinstructions(e)
                                      }
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="col-lg-12 col-sm-12 col-xs-12">
                                <form>
                                  <div className="col-lg-12 total  padding_top_25 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                      <p className="margin_0 margin_top_15">
                                        {CartMessage.TIP_YOUR_DRIVER}
                                      </p>
                                    </div>
                                    <div className="col-lg-12 pers col-sm-12 col-xs-12">
                                      {tipdatanew.length === 0 &&
                                        tipdata.map((data, index) => {
                                          return (
                                            <a
                                              key={Math.random()}
                                              className={
                                                data.value === true
                                                  ? "orange_price_btn"
                                                  : ""
                                              }
                                              onClick={() => addtipclick(data)}
                                            >
                                              {data.text + "%"}
                                            </a>
                                          );
                                        })}
                                      {tipdatanew.length > 0 &&
                                        tipdatanew.map((data, index) => {
                                          return (
                                            <a
                                              key={Math.random()}
                                              className={
                                                data.value === true
                                                  ? "orange_price_btn"
                                                  : ""
                                              }
                                              onClick={() => addtipclick(data)}
                                            >
                                              {data.text + "%"}
                                            </a>
                                          );
                                        })}
                                      <span className="size_19" style={{ color: "#9C9C9C" }}>
                                        ${" "}
                                        <input
                                          type="text"
                                          placeholder="Amount"
                                          value={
                                            tipamount != undefined &&
                                              tipamount != "" &&
                                              parseFloat(tipamount) > 0
                                              ? tipamount
                                              : ""
                                          }
                                          onChange={onchangetipamount}
                                        />
                                      </span>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                      <div className="row">
                                        <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                          <p className="margin_0 margin_top_15 size_19">
                                            <b className="color_black">
                                              Sub Total :
                                            </b>
                                          </p>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                          <p className="margin_0 margin_top_15 size_19">
                                            <span>
                                              {" "}
                                              {carttotal != undefined &&
                                                carttotal.subTotal !=
                                                undefined &&
                                                currency + " " + carttotal.subTotal.toFixed(2)}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      {
                                        promotionData !== null && promotionData !== undefined && promotionData?.promotionpercentagecal > 0 &&
                                        <div className="row">
                                          <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                            <p className="margin_0 margin_top_15 size_19">
                                              Promotion
                                              {`${promotionData?.promotionruletype === 2
                                                ? '(' + promotionData?.promotionpercentage.toFixed(2) + currency + ')'
                                                : '(' + promotionData?.promotionpercentagecal.toFixed(2) + '% '} `} :
                                            </p>
                                          </div>

                                          <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                            <p className="margin_0 margin_top_15 size_19">
                                              <span>
                                                -{" "} {currency + " " + promotionData?.promotionpercentagecal.toFixed(2)}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      }
                                      <div className="row">
                                        <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                          <p className="margin_0 margin_top_15 size_19">
                                            Reedem Points (
                                            {carttotal != undefined &&
                                              carttotal.reedemPoints !=
                                              undefined &&
                                              carttotal.reedemPoints}
                                            ) :
                                          </p>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                          <p className="margin_0 margin_top_15 size_19">
                                            <span>
                                              -{" "}
                                              {carttotal != undefined &&
                                                carttotal.reedemAmount != undefined &&
                                                currency + " " + carttotal.reedemAmount.toFixed(2)}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      {
                                        carttotal?.isDiscountApplied === true &&
                                        <div className="row">
                                          <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                            <p className="margin_0 margin_top_15 size_19">
                                              Discount ({discountPercent} %) :{" "}
                                            </p>
                                          </div>

                                          <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                            <p className="margin_0 margin_top_15 size_19">
                                              <span>
                                                -{" "}
                                                {discountAmount > 0 ? currency + " " + discountAmount.toFixed(2) : currency + " " + " 0.00"}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      }

                                      {pickupordelivery === "Delivery" && (
                                        <div className="row">
                                          <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                            <p className="margin_0 margin_top_15 size_19">
                                              Delivery :
                                            </p>
                                          </div>
                                          <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                            <p className="margin_0 margin_top_15 size_19">
                                              <span>
                                                {carttotal != undefined &&
                                                  carttotal?.deliveryCharges !=
                                                  undefined &&
                                                  (pickupordelivery ===
                                                    "Delivery" &&
                                                    dtotal &&
                                                    currency + " " + dtotal.toFixed(2))}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      <div className="row">
                                        <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                          <p className="margin_0 margin_top_15 size_19">
                                            <b className="color_black">
                                              Total Pre-Tax :
                                            </b>
                                          </p>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                          <p className="margin_0 margin_top_15 size_19">
                                            <span>
                                              {" "}
                                              {carttotal != undefined &&
                                                carttotal.subTotalWithDiscount != undefined &&
                                                currency + " " +
                                                parseFloat(carttotal.subTotalWithDiscount).toFixed(2)}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      {carttotal?.hstTotal > 0 &&
                                        (<div className="row">
                                          <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                            <p className="margin_0 margin_top_15 size_19">
                                              HST Tax (
                                              {carttotal != undefined &&
                                                carttotal.taxPercentage !=
                                                undefined &&
                                                carttotal.taxPercentage.toFixed(2)}
                                              %) :
                                            </p>
                                          </div>
                                          <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                            <p className="margin_0 margin_top_15 size_19">
                                              <span>
                                                {" "}
                                                {carttotal != undefined &&
                                                  carttotal.hstTotal !=
                                                  undefined &&
                                                  currency + " " + carttotal.hstTotal.toFixed(2)}
                                              </span>
                                            </p>
                                          </div>
                                        </div>)
                                      }


                                      {/* New GST Rules */}
                                      {cartTaxList && cartTaxList.map((taxes, index) => {

                                        return (
                                          <div className="row" key={index}>
                                            <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                              <p className="margin_0 margin_top_15 size_19">
                                                {taxes.FeesType === 2 ? <>{taxes?.TaxesName}{" "} ( {taxes?.Taxes.toFixed(2)} {" "} %) :</> : <>{taxes?.TaxesName}:</>}

                                              </p>
                                            </div>
                                            <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                              <p className="margin_0 margin_top_15 size_19">
                                                <span>
                                                  {" "}
                                                  {taxes != undefined &&
                                                    taxes?.Taxes !==
                                                    undefined &&
                                                    currency + " " + taxes?.TaxesRate.toFixed(2)}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      }
                                      )}


                                      {carttotal != undefined &&
                                        carttotal.systemAccessFee !=
                                        undefined &&
                                        carttotal.systemAccessFee > 0 && (
                                          <div className="row">
                                            <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                              <p className="margin_0 margin_top_15 size_19">
                                                System Access Fee :
                                              </p>
                                            </div>
                                            <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                              <p className="margin_0 margin_top_15 size_19">
                                                <span>
                                                  {" "}
                                                  {
                                                    carttotal &&
                                                    currency + " " + carttotal.systemAccessFee.toFixed(2)}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      <div className="row">
                                        <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                                          <p className="margin_0 margin_top_15 size_19">
                                            Tip :
                                          </p>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                                          <p className="margin_0 margin_top_15 size_19">
                                            <span>
                                              {" "}
                                              {tipvalue != undefined &&
                                                tipvalue > 0 ? currency + " " + tipvalue : currency + " " + "0.00"}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                      <hr />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                      <h3 className="margin_top_20 margin_bottom_20">
                                        TOTAL{" "}
                                        <span className="color_orange size_24 float_right weight_300">
                                          {" "}
                                          {grandtotal != undefined &&
                                            grandtotal &&
                                            currency + " " + grandtotal.toFixed(2)}
                                        </span>
                                      </h3>
                                    </div>
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                      {errorMessage === "" ? (
                                        <div>
                                          <DisplayMinimumOrderDelivery />
                                        </div>
                                      ) : (
                                        <a
                                          className="grey_btn"
                                          style={{ width: "inherit" }}
                                        >
                                          Checkout
                                        </a>
                                      )}
                                    </div>

                                  </div>
                                </form>
                              </div>
                            </div>
                            {pickupordelivery &&
                              pickupordelivery === "Delivery" && isGeoFancing === false && (
                                <div>
                                  <DeliveryCharges />
                                </div>
                              )}

                            {pickupordelivery &&
                              pickupordelivery === "Delivery" && isGeoFancing === true && (
                                <div>
                                  <GeoFancingDeliveryCharges />
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                {/*                 
                // cartdata === null||
                // cartdata === undefined ||
                // carttotal.grandTotal === undefined ||
                // carttotal?.cartCount === 0 &&
                
                  // cartdata?.cartDetails != undefined ||
                  // cartdata?.cartDetails?.cartItemDetails != undefined ||
                  // cartdata?.cartDetails?.cartItemDetails.length === 0  */}
                {(carttotal?.cartCount === 0 || cart?.cartitemcount === 0 || isOrdering === false) && restaurantinfo &&
                  (
                    <> <NoItemsCartComponent restaurantinfo={restaurantinfo} text='Cart' /> </>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* {showLogin === true &&
                    <LoginMainComponent restaurantinfo={restaurantinfo} />
                } */}
      </>
    );
  } else {
    return (<>
      <CartloginComponent />
    </>)
    //return window.open(`/${restaurantinfo.restaurantURL}/`, "_self");
  }

  // else if (userinfo === undefined || userinfo === null)
  //   return window.open(`/${restaurantinfo.restaurantURL}/`, "_self");
}

export default ShoppingCart;
