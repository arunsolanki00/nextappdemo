import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import RewardPointDetail from "./reward-point-detail";
import { OrderServices } from "../../redux/order/order.services";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import handleNotify from "../helpers/toaster/toaster-notify";
import { useRouter } from "next/router";

const OrderDetailSummary = (props) => {
  let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
  const { restaurantURL } = restaurantinfo;
  const router = useRouter();
  const { query: { dynamic, id, category, index } } = router;
  const [isProcessing, setIsProcessing] = useState(false)
  let sessionid = useSelector(({ session }) => session?.sessionid);
  const HandleFullOrderClick = (orderId) => {

    setIsProcessing(true);
    OrderServices.repeatOrder(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, orderId, 0, true, userinfo.customerId,sessionid).then((response) => {
      if (response.status === 1) {
        handleNotify("Your Order placed successfully", ToasterPositions.TopRight, ToasterTypes.Success);
        setIsProcessing(false);
        router.push("/" + restaurantURL + "/cart");
      } else {
        setIsProcessing(false);
        handleNotify("Something went wrong", ToasterPositions.TopRight, ToasterTypes.Error);
      }
    });
  }

  const orderSummary = props != undefined && props.orderdetailCal;
  const currency = orderSummary.currencysymbol;
  console.log(orderSummary?.total);
  return (
    <div className="col-lg-4 rt-s flush xsnoflush col-sm-12 col-xs-12">
      <RewardPointDetail />
      <div className="col-lg-12 col-sm-12 col-xs-12">
        <form>
          <div className="col-lg-12 total col-sm-12 col-xs-12 margin_top_15">
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                  <p className="margin_0 margin_top_15 size_19">
                    <b className="color_black">Sub Total :</b>
                  </p>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                  <p className="margin_0 margin_top_15 size_19">
                    <span>
                      {currency} {orderSummary?.subTotal.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              {Number(orderSummary.redeemAmount) > 0 && (
                <div className="row">
                  <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                    <p className="margin_0 margin_top_15 size_19">
                      Reedem Points ({orderSummary?.redeemPoints}) :
                    </p>
                  </div>
                  <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                    <p className="margin_0 margin_top_15 size_19">
                      <span>
                        -{currency}
                        {orderSummary?.redeemAmount.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {Number(orderSummary.discount) > 0 && (
                <div className="row">
                  <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                    <p className="margin_0 margin_top_15 size_19">Discount :</p>
                  </div>
                  <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                    <p className="margin_0 margin_top_15 size_19">
                      <span>
                        -{currency}
                        {orderSummary?.discount.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {Number(orderSummary.deliveryCharges) > 0 && (
                <div className="row">
                  <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                    <p className="margin_0 margin_top_15 size_19">Delivery :</p>
                  </div>
                  <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                    <p className="margin_0 margin_top_15 size_19">
                      <span>
                        {currency}
                        {orderSummary?.deliveryCharges.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                  <p className="margin_0 margin_top_15 size_19">
                    <b className="color_black">Total Pre-Tax :</b>
                  </p>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                  <p className="margin_0 margin_top_15 size_19">
                    <span>
                      {currency}
                      {orderSummary?.preTaxAmount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              {Number(orderSummary.hstTaxTotal) > 0 && (
                <div className="row">
                  <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                    <p className="margin_0 margin_top_15 size_19">
                      HST Tax ({orderSummary?.hstTaxPer}%) :
                    </p>
                  </div>
                  <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                    <p className="margin_0 margin_top_15 size_19">
                      <span>
                        {currency}
                        {orderSummary?.hstTaxTotal.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {orderSummary.cartTaxList && orderSummary.cartTaxList.map((taxes,index) => {
                return (
                  <div className="row" key={index}>
                    <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                      <p className="margin_0 margin_top_15 size_19">
                        {taxes?.TaxesName}:
                      </p>
                    </div>
                    <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                      <p className="margin_0 margin_top_15 size_19">
                        <span>
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

              <div className="row">
                <div className="col-lg-8 col-sm-8 col-xs-8 text-left">
                  <p className="margin_0 margin_top_15 size_19">Tip :</p>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-4 text-right">
                  <p className="margin_0 margin_top_15 size_19">
                    <span>
                      {currency}
                      {orderSummary?.tip.toFixed(2)}
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
                  {currency}
                  {orderSummary?.calculatedTotal.toFixed(2)}
                </span>
              </h3>
            </div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
              <a className="blue_btn padding_right_20 padding_left_20" onClick={() => HandleFullOrderClick(props.orderId)}>
                {isProcessing === false ? ("Repeat Entire Order") : ("Processing")}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetailSummary;
