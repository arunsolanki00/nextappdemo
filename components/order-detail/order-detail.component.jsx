import React, { useEffect, useState } from "react";
import Image from "next/image";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import OrderDetailSummary from "./order-detail-summary";
import { OrderServices } from "../../redux/order/order.services";
import handleNotify from "../helpers/toaster/toaster-notify";
import { useRouter } from "next/router";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";

const OrderDetailComponent = (props) => {
  const [orderdetails, setOrderdetails] = useState([]);
  const [orderdetailCal, setOrderdetailCal] = useState();
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
 let customerId=userinfo ? userinfo.customerId:0;
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );
  const restaurantId = restaurantinfo.restaurantId;
  const locationId = restaurantinfo.defaultlocationId;
  const router = useRouter();
  const { query: { dynamic, id, category, index } } = router;
  useEffect(() => {
    OrderServices.getOrderInfo(restaurantId, locationId, props.orderId, customerId).then((response) => {
      if (response) {
        const result = response.result.orderDetailInfo;
        if (result != undefined && result.OrderDetailCal !== undefined) {

          setOrderdetails(result.OrderDetails);
          setOrderdetailCal(result != undefined && result.OrderDetailCal);
        }
      }
    });
  }, []);

  const handleOrderClick = (orderId, orderDetailId) => {
    OrderServices.repeatOrder(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, orderId, orderDetailId, false, customerId).then((response) => {
      if (response.status === 1) {
        handleNotify("Your Order placed successfully", ToasterPositions.TopRight, ToasterTypes.Success);
        router.push("/" + restaurantinfo.restaurantURL + "/cart");
      } else {
        handleNotify("Something went wrong", ToasterPositions.TopRight, ToasterTypes.Error);
      }
    });
  }

  const itemList = [];
  itemList.push(
    <>
      {orderdetails && orderdetailCal != undefined && orderdetailCal && orderdetailCal !== undefined && (
        <>
          <div className="row">
            <div className="col-lg-12 h1-margin pull-right title flush xsnoflush col-sm-12 col-xs-12">
              <h1 className="visible-xs">&nbsp;</h1>
              <h3 className="hidden-xs color_black"> {orderdetailCal != undefined && orderdetailCal?.date}</h3>
              <p className=" hidden-xs color_grey size_20 weight_300">
                Order No. {orderdetailCal != undefined && orderdetailCal?.orderNo}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-lg-8 space-right col-sm-12 col-xs-12">
                  <div className="row">
                    {orderdetails.map((order, index) => (
                      <div key={Math.random()}>
                        <div className="row">
                          <div className="col-lg-2 flush xsnoflush text-center col-sm-3 col-xs-12">
                            <div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
                              <img
                                src={`${order.imgname?.trim() === ""  || order.imgname === null ?  "/images/defaultfood.JPG" : order.imgname}`}  
                                className="itemimage"
                                alt
                                style={{width:"120px"}}
                              />
                            </div>
                          </div>
                          <div className="col-lg-10 col-lg-offset-0 flush xsnoflush col-sm-9 col-xs-10 col-xs-offset-1">
                            <div className="itembox">
                              <div className="col-lg-12 col-sm-12 col-xs-12 text-right" >
                                <h3>
                                  <a
                                    className="blue_btn edit_btn padding_left_20 padding_right_20 d-inline-block edit width_auto"
                                    style={{ lineHeight: "30px", textAlign: "right" }}
                                    onClick={() => handleOrderClick(props.orderId, order.orderdetailId)}
                                  >
                                    <i className="fa fa-refresh" /> Re-order
                                    this item
                                  </a>
                                </h3>
                              </div>
                              <div className="col-lg-12 col-sm-12 col-xs-12">
                                <h3 className="color_black margin_bottom_10 margin_top_0">
                                  {order.itemName}
                                </h3>
                                <p>{order.subOptionList}</p>
                              </div>
                              <div className="col-lg-12 col-sm-12 col-xs-12">
                                <hr className="grd" />
                              </div>
                              <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                            </div>
                            <div className="col-lg-6 text-left col-sm-6 col-xs-12">
                              <div className="quantity">
                                <h4>Quantity : {order.quantity} {"  "}  Unit Price : {order.netprice && order.netprice.toFixed(2)}</h4>
                              </div>
                            </div>
                            <div className="col-lg-6 o-btn-in text-right col-sm-6 col-xs-12">
                              <a className="orange_price_btn" href="#">
                                ${order.orderdetailTotal && order.orderdetailTotal.toFixed(2)}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-sm-12 col-xs-12 xsnoflush">
                            <hr className="gr" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <OrderDetailSummary orderdetailCal={orderdetailCal} orderId={props.orderId} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {itemList}
    </>
  );
};

export default OrderDetailComponent;
