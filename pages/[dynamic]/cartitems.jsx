import Head from "next/head";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
// import { getSessionKey } from "../../components/Common/auth";
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
  cartcheckout,
  setcartgrandtotal,
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
import { createSessionId } from "../../redux/session/session.action";
import { v4 as uuidv4 } from 'uuid';
import { CartloginComponent } from "../../components/cart-login/cart-login";
// import { MemoizedCartCounterComponent } from "../Header/cart-counter.component";
  const Cartlogin_Component = () => {
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
    let cart = useSelector(({ cart }) => cart);
    let carttotal = cart?.carttotal && cart.carttotal;
    let cartdata = cart?.cartitemdetail && cart?.cartitemdetail;
    let rewardpoint = cart?.rewardpoints && cart.rewardpoints;
    // let cartsessionId = restaurantinfo && userinfo && getSessionKey(restaurantinfo.restaurantId, userinfo && userinfo.customerId, restaurantinfo.defaultlocationId);
    let sessionidObj = useSelector(({ session }) => session?.sessionid);

    // let sessionidObj=session?.sessionid;
    console.log(sessionidObj,"init id");
    let isGeoFancing = location && location.locationId === restaurantinfo.defaultlocationId ? location.isGeoFencing : false;
  
    const pickupordelivery = useSelector(
      ({ selecteddelivery }) => selecteddelivery.pickupordelivery
    );
    const deliveryaddressinfo = useSelector(
      ({ selecteddelivery }) => selecteddelivery.selecteddeliveryaddress
    );
  
    let cartTaxList = carttotal?.cartTaxList && carttotal.cartTaxList;
  
    const [tipdata, settipdata] = useState([
      { id: 1, value: false, text: "10" },
      { id: 2, value: false, text: "20" },
      { id: 3, value: false, text: "30" },
    ]);
    const [tipdatanew, settipdatanew] = useState([]);
  
    const [tipvalue, settipvalue] = useState(carttotal?.totalTip && carttotal.totalTip.toFixed(2));
    // const [grandtotal, setgrandtotal] = useState(carttotal.grandTotal != undefined ? parseFloat(carttotal.grandTotal) + parseFloat(tipvalue) : 0);
    const [grandtotal, setgrandtotal] = useState(carttotal?.grandTotal != undefined ? parseFloat(carttotal.grandTotal) : 0);
    // const [tipamount, settipamount] = useState(carttotal.tipAmount);
    const [tipamount, settipamount] = useState(carttotal?.totalTip && carttotal?.totalTip > 0 ? carttotal?.totalTip.toFixed(2) : 0);
    const [specialinstructions, setspecialinstructions] = useState(cart?.orderinstruction && cart.orderinstruction == "" ? "" : cart.orderinstruction);
    const [loader, setloader] = useState(false);
    const [tipPercent, settipPercent] = useState(parseFloat(carttotal?.tipPercentage) > 0 ? parseFloat(carttotal.tipPercentage) : '');
  
    const [discountAmount, setdiscountAmount] = useState(0);
    const [discountPercent, setdiscountPercent] = useState(0);
  
    const [errorMessage, setErrorMessage] = useState("");
  
    const [currency, setcurrency] = useState(GetCurrency());
  
    const [isOrdering, setIsOrdering] = useState(false);
  
    // const [sessionId, setsessionId] = useState(sessionidObj);
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
      console.log("userinfo",userinfo)
        // if(rewardpoint){
        let rpoint = 0;
        let ramount = 0;
        if (rewardpoint?.redeemPoint) {
          rpoint = rewardpoint.redeemPoint > 0 ? rewardpoint.redeemPoint : 0;
        }
        if (rewardpoint?.rewardvalue && rpoint > 0) {
          ramount = rpoint / rewardpoint.rewardvalue;
        }
        let sessionid=sessionidObj;
        console.log("sessionid useeffect",sessionid)

        // if(sessionid === null){
        //   sessionid=uuidv4();
        //   dispatch(createSessionId(sessionid));
        // }

        if(sessionidObj!==null){
          dispatch(getCartItem(
            sessionid ,
            restaurantinfo.defaultlocationId,
            restaurantinfo.restaurantId,
            0,
            // userinfo && userinfo.customerId,
            (userinfo!==null && userinfo!==undefined) ? userinfo.customerId : 0,
            rpoint,
            ramount,
            deliveryaddressinfo && pickupordelivery === "Delivery"
              ? deliveryaddressinfo.deliveryaddressId
              : 0,
            0,  
            tipamount
          )
          );
          dispatch(getCartItemCount(sessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, userinfo?.customerId?userinfo.customerId:0));
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
                carttotal.subTotalWithDiscount
              );
              settipamount(tipamountcal);
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
        //  setgrandtotal(parseFloat(carttotal.grandTotal) + parseFloat(tipvalue));
        //setgrandtotal(parseFloat(carttotal.grandTotal) + parseFloat(tipvalue));
        // if (carttotal.discountPercentage!=undefined && carttotal.discountPercentage != 0 && parseFloat(carttotal.discountPercentage) > 0) {
        //   let pvalue = (carttotal.subTotal * parseFloat(carttotal.discountPercentage)) / 100;
        //   setdiscountPercent(parseFloat(carttotal.discountPercentage).toFixed(2));
        //   if(pvalue > 0)
        //     setdiscountAmount(parseFloat(pvalue).toFixed(2));
        //     
        //   }
        // if (carttotal.discountPercentage != undefined && parseFloat(carttotal.discountPercentage) > 0) {
        setdiscountPercent(parseFloat(carttotal.discountPercentage).toFixed(2));
        setdiscountAmount(carttotal.discountAmount);
        setgrandtotal(carttotal.grandTotal);
  
        //tip update on grand total update
        let tamount = 0;
        if (tipPercent) {
          tamount = calculateTip(tipPercent, carttotal.subTotalWithDiscount);
          settipamount(tamount);
          settipvalue(tamount);
        }
      }
    }, [carttotal && carttotal?.grandTotal > 0 && carttotal?.grandTotal]);
  
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
            carttotal.subTotalWithDiscount
          ); //parseInt(selectedtip.text) * parseFloat(carttotal.subTotalWithDiscount) / 100;
          settipamount(tipamount);
          settipvalue(parseFloat(tipamount));
          // setgrandtotal(
          //   parseFloat(tipamount) + parseFloat(carttotal.grandTotal.toFixed(2))
          // );
  
          updatecart(selectedtip.text, tipamount);
        } else {
          settipvalue(0);
          settipamount(0);
          setgrandtotal(parseFloat(carttotal.grandTotal.toFixed(2)));
          updatecart(0, 0);
        }
      }
    };
  
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
      // let cartsessionId = getSessionKey(
      //   restaurantinfo.restaurantId,
      //   userinfo.customerId,
      //   restaurantinfo.defaultlocationId
      // );
      dispatch(
        carttotaldata(
          cartsessionId,
          restaurantinfo.defaultlocationId,
          restaurantinfo.restaurantId,
          userinfo.customerId,
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
  
    
  
    // useEffect(() => {
    //   settipamount(carttotal.tipAmount);
    // }, [carttotal.tipAmount])
  
    const DisplayMinimumOrderDelivery = () => {
  
      if (pickupordelivery === "Pickup") {
        if (carttotal.subTotal >= minimumtakeoutorder) {
          return (
            <Link href={`/${restaurantinfo.restaurantURL}/pickupconfirmation`}>
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
            
            <Link href={`/${restaurantinfo.restaurantURL}/deliveryconfirmation`}>
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
  
    const onCheckoutClick = () => {
      setloader(true);
      let lstcartid = [];
      cartdata.cartDetails.cartItemDetails.map((item) => {
        lstcartid.push(item.cartid);
      })
      var obj = {};
      obj = {
        tipamount: tipvalue,
        rewardpoint: rewardpoint,
        specialinstructions: specialinstructions,
        cartid: lstcartid,
        restaurantId: restaurantinfo.restaurantId,
        locationId: restaurantinfo.defaultlocationId,
        customerId: userinfo && userinfo.customerId,
        cartsessionId: cartsessionId,
        tipPercent: tipPercent,
      }
      dispatch(cartcheckout(obj, restaurantinfo.restaurantId));
      dispatch(setcartgrandtotal(grandtotal));
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
    const calulateTotal=()=>{
      let total=0;
      cartdata?.cartDetails?.cartItemDetails.map(data=>{
         total+=data.totalprice;
      })
      return total.toFixed(2);
    }
   const itemstotal=calulateTotal();
 return (
    <>
    <div>
    <Head>
          <title>
            {/* Review Cart | {restaurantinfo.restaurantname}: Online Ordering */}
          </title>
          <meta name="description" content="Online description" />
    </Head>
        <div className="container-fluid">
        <div className="row row-eq-height">
        <LeftMenuComponent/>
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
                  <>
                  <div className="row">
                      <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
                       <div className="row">
                       <div className="col-lg-8 space-right col-sm-12 col-xs-12">
                          <ShoppingCartItem cartdata={cartdata} />
                        </div>
                        <div className="col-lg-4 rt-s flush xsnoflush col-sm-12 col-xs-12">

  
                          <div className="col-lg-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 total  padding_top_25 col-sm-12 col-xs-12">
                          <div className="col-lg-12 col-sm-12 col-xs-12">
                                    <h3 className="margin_top_20 margin_bottom_20">
                                      TOTAL{" "}
                                      <span className="color_orange size_24 float_right weight_300">
                                        {" "}
                                        {itemstotal != undefined &&
                                          itemstotal &&
                                          currency + " " + itemstotal}
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
                          </div>
                        </div>
                       </div>
                       </div>
                  </div>



                  {/* *************** */}
                  
                  </>
                )}
                {/* <div className="row">
                      <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
                       <div className="row">
                       <div className="col-lg-8 space-right col-sm-12 col-xs-12">
                          <ShoppingCartItem />
                        </div>
                        <div className="col-lg-4 rt-s flush xsnoflush col-sm-12 col-xs-12">
                        <div>
                            <h1>vp</h1>
                              <CartRewardPoint />
                        </div>
                            <div className="col-lg-12 spe_btn col-sm-12 col-xs-12 checkout">
                            <div className="box margin_top_30">
                              <h3>{CartMessage?.SPECIALS_INSTRUCTIONS}</h3>
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
                          <div className="col-lg-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 total  padding_top_25 col-sm-12 col-xs-12">
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
                          </div>
                        </div>
                       </div>
                       </div>
                  </div> */}
                  {(carttotal?.cartCount === 0 || cart?.cartitemcount === 0 || isOrdering === false) && restaurantinfo &&
                (
                  <> <NoItemsCartComponent restaurantinfo={restaurantinfo} text='Cart' /> </>
                )}
        </div>
        </div>
        </div>
    </div>
    </>
  )
}
export default Cartlogin_Component;
