import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MyOrderServices } from "../../redux/myorders/myorders.services";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  getMenuItemDetailes,
  selectedMenuItem,
} from "../../redux/menu-item/menu-item.action";
import { MyOrdersSkeleton } from "../Common/Skeleton/myorders-skeleton.component";
import NoItemsCartComponent from "../ShoppingCart/no-items-cart.component";

const MyOrdersComponent = ({ restaurantinfo }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    query: { dynamic },
  } = router;
  const userinfo = useSelector(
    ({ userdetail }) => userdetail.loggedinuser,
    shallowEqual
  );
  let customerId=userinfo?userinfo.customerId:0;
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderHistoryFull, setOrderHistoryFull] = useState([]);
  const [loadingstate, setloadingstate] = useState(false)
  const [showAll, setshowAll] = useState(false)

  useEffect(() => {
    setloadingstate(true)
    const timer = setTimeout(() => {
      MyOrderServices.getOrderHistory(
        customerId,
        restaurantinfo.defaultlocationId,
        restaurantinfo.restaurantId
      ).then((response) => {
        if (response) {
          if (response.orderHistory !== undefined) {
            let orderhistorylisttop = [];
            let orderhistorylistFull = [];
            response.orderHistory.map((details, index) => {
              if (index <= 10) {
                orderhistorylisttop.push(details)
              } else {
                orderhistorylistFull.push(details);
              }
            });
            setOrderHistory(orderhistorylisttop);
            setOrderHistoryFull(orderhistorylistFull);
          }
          else
            setOrderHistory([]);
        }
        setloadingstate(false)
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const selectedItemClick = (item) => {
    if (item != undefined) {
      dispatch(selectedMenuItem(item));
      dispatch(
        getMenuItemDetailes(
          restaurantinfo.restaurantId,
          restaurantinfo.defaultlocationId,
          0,
          item.menuitemid
        )
      );
    }
  };

  const displayFullList = () => {
    setshowAll(!showAll);
  }

  return (
    <div>
      <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12" style={{ textAlign: "right" }}>
        <a className="orange_price_btn orderPriceBtn"> Total: {orderHistory?.length + orderHistoryFull?.length} </a></div>
      {!loadingstate ||
        (orderHistory && orderHistory !== undefined && orderHistory?.length) ? (
        <div className="row">
          <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
            <div className="row">
              {orderHistory.length > 0 && orderHistory.map((details, index) => (
                <>
                  <div className="col-lg-6 col-sm-12 col-xs-12 flush-left" key={index}>
                    <div className="col-lg-12 order col-sm-12 col-xs-12">
                      <div className="col-lg-12 flush col-sm-10 col-xs-12">
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                          <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                            {details.creationdate}
                            <Link
                              shallow={false}
                              key={Math.random()}
                              href="/[dynamic]/orderdetail/[orderId]"
                              as={`/${dynamic}/orderdetail/${details.orderId}`}
                            >
                              <a
                                className="blue_btn edit_btn margin_left_10 d-inline-block edit"
                                onClick={() => selectedItemClick(details)}>
                                <i className="fa fa-refresh" /> Re-order
                              </a>
                            </Link>
                            <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                              {details.orderType}
                            </span>
                          </h3>
                        </div>
                        <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12">
                          <hr className="grd margin_bottom_10" />
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                          <div className="row">
                            <div className="col-lg-10 col-sm-10 col-xs-12">
                              {details.orderDetails &&
                                details.orderDetails.map((history, index) => (
                                  <h3
                                    className="margin_top_0 margin_bottom_10 weight_500 size_22"
                                    id={Math.random()}
                                    key={index}
                                  >
                                    {history.itemname}
                                  </h3>
                                ))}
                              <p className="color_000">
                                Order No. {details.orderno}
                              </p>
                            </div>
                            <div className="col-lg-2 col-sm-2 col-xs-12">
                              <p className="color_000">
                                <a
                                  className="orange_price_btn orderPriceBtn"
                                >
                                  ${details?.totalamount.toFixed(2)}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {details.orderDetails &&
                      details.orderDetails.map((history, index) => (
                        <Link
                          shallow={false}
                          key={Math.random()}
                          href="/[dynamic]/orderdetail/[orderId]"
                          as={`/${dynamic}/orderdetail/${history.orderId}`}
                        >
                          <a onClick={() => selectedItemClick(details)}>
                            <span className="fa angle size_15 angle-round bg_green color_white fa-angle-right right_0"></span>
                          </a>
                        </Link>
                      ))}
                  </div>
                </>
              ))}
              {showAll && orderHistoryFull.length > 0 && orderHistoryFull.map((details, index) => (
                <>
                  <div className="col-lg-6 col-sm-12 col-xs-12 flush-left" key={index}>
                    <div className="col-lg-12 order col-sm-12 col-xs-12">
                      <div className="col-lg-12 flush col-sm-10 col-xs-12">
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                          <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                            {details.creationdate}
                            <Link
                              shallow={false}
                              key={Math.random()}
                              href="/[dynamic]/orderdetail/[orderId]"
                              as={`/${dynamic}/orderdetail/${details.orderId}`}
                            >
                              <a
                                className="blue_btn edit_btn margin_left_10 d-inline-block edit"
                                onClick={() => selectedItemClick(details)}>
                                <i className="fa fa-refresh" /> Re-order
                              </a>
                            </Link>
                            <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                              {details.orderType}
                            </span>
                          </h3>
                        </div>
                        <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12">
                          <hr className="grd margin_bottom_10" />
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                          <div className="row">
                            <div className="col-lg-10 col-sm-10 col-xs-12">
                              {details.orderDetails &&
                                details.orderDetails.map((history, index) => (
                                  <h3
                                    className="margin_top_0 margin_bottom_10 weight_500 size_22"
                                    id={Math.random()}
                                    key={index}
                                  >
                                    {history.itemname}
                                  </h3>
                                ))}
                              <p className="color_000">
                                Order No. {details.orderno}
                              </p>
                            </div>
                            <div className="col-lg-2 col-sm-2 col-xs-12">
                              <p className="color_000">
                                <a
                                  className="orange_price_btn orderPriceBtn"
                                >
                                  ${details?.totalamount.toFixed(2)}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {details.orderDetails &&
                      details.orderDetails.map((history, index) => (
                        <Link
                          shallow={false}
                          key={Math.random()}
                          href="/[dynamic]/orderdetail/[orderId]"
                          as={`/${dynamic}/orderdetail/${history.orderId}`}
                        >
                          <a onClick={() => selectedItemClick(details)}>
                            <span className="fa angle size_15 angle-round bg_green color_white fa-angle-right right_0"></span>
                          </a>
                        </Link>
                      ))}
                  </div>
                </>
              ))}
              {orderHistoryFull.length > 0 && <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12" style={{ textAlign: "right" }}>
                <div className="row">
                  {showAll === false ? (<a onClick={displayFullList} className="orange_price_btn orderPriceBtn"> Show Full List </a>)
                    :
                    (<a onClick={displayFullList} className="orange_price_btn orderPriceBtn"> Hide Full List </a>)
                  }
                </div>
              </div>
              }
              {orderHistory?.length === 0 &&
                <>
                  <> <NoItemsCartComponent restaurantinfo={restaurantinfo} text='Order list' /> </>
                </>
              }
            </div>
          </div>
        </div>
      ) : <MyOrdersSkeleton />}
    </div>
  )
}

export default MyOrdersComponent;
