import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { carttotaldata, getCartItem, getCartItemCount, setrewardpoint, updateCartItem, updateCartItemCount } from "../../redux/cart/cart.action";
import { CartServices } from "../../redux/cart/cart.services";
// import { getSessionKey } from "../Common/auth";
import { GetCurrency } from "../helpers/utility";
import { decimalValidate, numberValidate } from "../helpers/validate";

const CartRewardPoint = () => {
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail
  );
  const userinfo = useSelector(
    ({ userdetail }) => userdetail.loggedinuser,
    shallowEqual
  );
  
  let customerId=userinfo ? userinfo.customerId : 0;
  let carttotal = useSelector(({ cart }) => cart.carttotal);
  let cartsubtotal = carttotal.subTotal;
  let subTotalWithDiscount = carttotal.subTotalWithDiscount;
  let sessionid = useSelector(({ session }) => session?.sessionid);
  let rewardpoints = useSelector(({ cart }) => cart.rewardpoints);
  const deliveryaddressinfo = useSelector(
    ({ selecteddelivery }) => selecteddelivery.selecteddeliveryaddress
  );
  let rewardvalue = rewardpoints?.rewardvalue;
  const pickupordelivery = useSelector(
    ({ selecteddelivery }) => selecteddelivery.pickupordelivery
  );

  const dispatch = useDispatch();
  const [amount, setamount] = useState(parseFloat(rewardpoints?.rewardamount) > 0 ? parseFloat(rewardpoints?.rewardamount).toFixed(2) : 0);
  const [point, setpoint] = useState(rewardpoints?.rewardPoint);
  const [errorMessage, seterrorMessage] = useState("");
  // const [cartsessionId, setcartsessionId] = useState(
  //   cartsessionId !== "" &&
  //   getSessionKey(restaurantinfo.restaurantId, userinfo.customerId,restaurantinfo.defaultlocationId)
  // );
  const [redeemamount, setredeemamount] = useState();
  const [redeempoint, setredeempoint] = useState();

  const [currency, setcurrency] = useState(GetCurrency());
  const [disabledText,setDisabledText] = useState(false);

  const inputRP = useRef(null);

  useEffect(() => {
    if (userinfo) {
      if (
        rewardpoints &&
        rewardpoints.totalRewardPoints == 0 &&
        rewardpoints.rewardamount == 0
      ) {
        
      } else {
        if (rewardpoints?.rewardPoint > 0 && rewardvalue > 0) {
          setpoint(rewardpoints.rewardPoint);
          setamount(rewardpoints.rewardamount);
          setredeempoint(rewardpoints.redeemPoint);
          setredeemamount(rewardpoints.redeemPoint / rewardvalue);
          dispatch(
            carttotaldata(
              sessionid,
              restaurantinfo.defaultlocationId,
              restaurantinfo.restaurantId,
              userinfo.customerId,
              0,
              rewardpoints.redeemPoint,
              rewardpoints.redeemPoint / rewardpoints.rewardvalue,
              carttotal.tipPercentage,
              carttotal.tipAmount,
              pickupordelivery === "Delivery" &&
              deliveryaddressinfo &&
              deliveryaddressinfo.deliveryaddressId
            )
          );
        }
      }
    }
  }, []);

  const onchangerewardamount = (item) => {
    let objamount = item.target.value === "" ? 0 : item.target.value;
    let objTotalRewardAmount =
      rewardpoints.totalRewardPoints > 0
        ? rewardpoints.totalRewardPoints / rewardpoints.rewardvalue
        : 0;

    //check only decimal and numeric value allowed
    if (!decimalValidate(objamount)) {
      return;
    }

    //check and set total rewardpoint value, if blank textbox
    if (
      redeemamount.length <= 1 &&
      (item.target.value === "" || item.target.value === ".")
    ) {
      setredeemamount("");
      setredeempoint("");
      setamount((rewardpoints.totalRewardPoints / rewardvalue).toFixed(2));
      setpoint(rewardpoints.totalRewardPoints);
      return;
    }

    //chck if entered value is lessthan total reward point
    if (objamount > rewardpoints.totalRewardPoints / rewardpoints.rewardvalue) {
      return;
    }
    //check entered amount is less than cart sub total
    // if (objamount > cartsubtotal) {
     if (parseFloat(objamount) > subTotalWithDiscount.toFixed(1)) {
      return;
     }

    if (objamount === 0) {
      setredeemamount("");
      setredeempoint("");
    } else {
      setamount((objTotalRewardAmount - objamount).toFixed(2));
      setpoint(rewardpoints.totalRewardPoints - objamount * rewardvalue);
      setredeemamount(objamount);
      setredeempoint(objamount * rewardvalue);
    }
  };

  const onchangerewardpoint = (item) => {
    let objpoint = item.target.value === "" ? 0 : item.target.value;
    let objTotalRewardpoint =
      rewardpoints.totalRewardPoints > 0 ? rewardpoints.totalRewardPoints : 0;

       
    //check only decimal and numeric value allowed
    if (!numberValidate(objpoint)) {
      return;
    }
    let objamount = (rewardpoints.totalRewardPoints / rewardvalue).toFixed(1);
    //check and set total rewardpoint value, if blank textbox
    if (redeempoint.length == 1 && item.target.value === "") {
      setredeemamount("");
      setredeempoint("");
      setpoint(rewardpoints.totalRewardPoints);
      setamount(objamount);
      return;
    }
    objpoint=objpoint > 0? parseInt(objpoint) : objpoint;
    //chck if entered value is lessthan total reward point
    if (objpoint > rewardpoints.totalRewardPoints) {
      return;
    }

    //check entered amount is less than cart sub total
    if (parseFloat((objpoint / rewardvalue).toFixed(1)) > cartsubtotal.toFixed(1)) {
      return;
    }

    if (parseFloat((objpoint / rewardvalue).toFixed(1)) > subTotalWithDiscount.toFixed(1)) {
      return;
    }

    if (objpoint === 0) {
      setredeemamount("");
      setredeempoint("");
    } else {
      setpoint(objTotalRewardpoint - objpoint);
      setamount(((objTotalRewardpoint - objpoint) / rewardvalue).toFixed(2));
      setredeemamount((objpoint / rewardvalue).toFixed(2));
      setredeempoint(objpoint);
    }
  };

  const onClickRewardClear = () => {
    if(redeemamount > 0 && redeempoint > 0) {
      setredeemamount(0);
      setredeempoint(0);
      
      CartServices.checkCustomerRewardPoints(
        restaurantinfo.restaurantId,
        userinfo.customerId,
        0,
        0
      ).then((response) => {
         ;
        if (response.status == 1) {
           ;
          let rewards = {
            rewardvalue: rewardvalue,
            rewardamount: (userinfo.totalRewardPoints / rewardvalue - 0).toFixed(2),
            rewardPoint: userinfo.totalRewardPoints - 0,
            totalRewardPoints: userinfo.totalRewardPoints,
            redeemPoint: 0,
          };
  
          setpoint(rewards.rewardPoint);
          setamount(rewards.rewardamount);
          dispatch(setrewardpoint(rewards));
  
          dispatch(
            carttotaldata(
              sessionid,
              restaurantinfo.defaultlocationId,
              restaurantinfo.restaurantId,
              userinfo.customerId,
              0,
              0,
              0,
              carttotal.tipPercentage,
              carttotal.tipAmount,
              pickupordelivery === "Delivery" &&
              deliveryaddressinfo &&
              deliveryaddressinfo.deliveryaddressId
            ));
        }
      });
      setDisabledText(false);
    }
    inputRP.current.focus();
  }

  const onclickrewardsubmit = () => {
     
    if (redeempoint != undefined || redeemamount != undefined) {
      if(redeempoint === 0 && redeemamount === 0){
        inputRP.current.focus();
        return;
      }
      else if (
        parseInt(redeempoint) <= userinfo.totalRewardPoints &&
        parseInt(redeempoint) > -1
      ) {
         ;
        CartServices.checkCustomerRewardPoints(
          restaurantinfo.restaurantId,
          userinfo.customerId,
          redeempoint,
          redeemamount
        ).then((response) => {
           ;
          if (response.status == 1) {
             ;
            let rewards = {
              rewardvalue: rewardvalue,
              rewardamount: (userinfo.totalRewardPoints / rewardvalue - redeemamount).toFixed(2),
              rewardPoint: userinfo.totalRewardPoints - redeempoint,
              totalRewardPoints: userinfo.totalRewardPoints,
              redeemPoint: redeempoint,
            };

            setpoint(rewards.rewardPoint);
            setamount(rewards.rewardamount);

            dispatch(setrewardpoint(rewards));

            dispatch(
              carttotaldata(
                sessionid,
                restaurantinfo.defaultlocationId,
                restaurantinfo.restaurantId,
                userinfo.customerId,
                0,
                redeempoint,
                redeemamount,
                carttotal.tipPercentage,
                carttotal.tipAmount,
                pickupordelivery === "Delivery" &&
                deliveryaddressinfo &&
                deliveryaddressinfo.deliveryaddressId
              )
            );

            // dispatch(getCartItem(cartsessionId, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, 0, userinfo.customerId, redeempoint, redeemamount,
            //   deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));
            // dispatch(getCartItemCount(cartsessionId, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, userinfo.customerId));
            // updateCartItem();
            // updateCartItemCount();
          }
          setDisabledText(true);
        });
      } else if (redeempoint > point && redeemamount > amount) {
        seterrorMessage("Reward point must be less than you have earned");
      }
    }
  };

  

  return (
    <div className="col-lg-12 col-sm-12 col-xs-12">
      <div className="col-lg-12 orange_div ora col-sm-12 col-xs-12 text-center removedLHeight width_100">
        <div className="col-lg-12 col-sm-12 col-xs-12 text-center">
          <div className="color_white size_15">
            You have <em>{point}</em> reward points, worth{" "}
            <em className="color_white size_24">
              {currency}
              {amount}
            </em>
            <br />
            <em className="sm  color_white width_100 size_12">
              You can redeem {" "} {point} {" "}points or {" "} {currency}{" "}
              {amount}
            </em>
          </div>
        </div>
        <div className="col-lg-12 col-sm-12 col-xs-12 ">
          <hr />
        </div>
        {/* <form> */}
          <div className="col-lg-12 text-center col-sm-12 col-xs-12 ">
            <label className="label_small">Enter: {currency}</label>
            <input
              className="input_small color_white"
              type="text"
              value={redeemamount === 0 ? '' : redeemamount?redeemamount:''}
              onChange={(event) => onchangerewardamount(event)}
              disabled ={disabledText === true ? true : point <= 0 ? true : false}
            />
            <label className="or_text" >
              OR
            </label>
            <input
              className="input_small color_white"
              type="text"
              value={redeempoint === 0 ?  '': redeempoint ? redeempoint:''}
              onChange={(event) => onchangerewardpoint(event)}
              disabled ={disabledText===true?true:point<=0?true:false}
              ref={inputRP}
            />
            <label className="label_small">pts</label>
          </div>

          <div id="errormessage" className="text-align-center">
            {" "}
            {errorMessage && errorMessage}{" "}
          </div>

          <div className="col-lg-6 text-center col-sm-6 col-xs-6">
            <a className="submit_white" onClick={() => onclickrewardsubmit()}>
              OK
            </a>
          </div>
          <div className="col-lg-6 text-center col-sm-6 col-xs-6">
            <a className="submit_white" onClick={() => onClickRewardClear()}>
              Clear
            </a>
          </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default CartRewardPoint;
