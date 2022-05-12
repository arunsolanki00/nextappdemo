import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormatOrderObject } from "../Common/format-order-object";
import Link from "next/link";
import {
  updateCartItemCount,
  getCartItemCount,
  getCartItem,
  updateCartItem,
} from "../../redux/cart/cart.action";
import { CartTypes } from "../../redux/cart/cart.types";
import { CartServices } from "../../redux/cart/cart.services";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import { MenuItemServices } from "../../redux/menu-item/menu-item.services";
import { MenuItemTypes } from "../../redux/menu-item/menu-item.types";
// import { getSessionKey } from "../Common/auth";
import handleNotify from "../helpers/toaster/toaster-notify";
import LoginMainComponent from "../login/login.component";
import {
  getMenuItemList,
  selectedMenuItem,
} from "../../redux/menu-item/menu-item.action";
import { useRouter } from "next/router";
import { IsOrderDisable } from "../Common/custom/isorderdisable.component";

function MenuCategoryCart({ sendDataToParent }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    query: { dynamic, id, category, index },
  } = router;

  const [lstcarttopping, setlstcarttopping] = useState([]);
  const [cartdeleteconfirm, setcartdeleteconfirm] = useState(false);
  const [deleteitem, setdeleteitem] = useState(null);
  const userinfo = useSelector(
    ({ userdetail }) => userdetail.loggedinuser,
    shallowEqual
  );
  let totalprice = 0;
  const customerId = userinfo ? userinfo.customerId : 0;
  let menuItemDetail = useSelector(
    ({ menuitem }) => menuitem.menuitemdetaillist
  );
  let selectedsize =
    menuItemDetail != undefined &&
    menuItemDetail.size != undefined &&
    menuItemDetail.size.filter((x) => x.sizeselected == true);

  let selectedtopping =
    selectedsize.length > 0 &&
    menuItemDetail != undefined &&
    menuItemDetail.topping != undefined &&
    menuItemDetail.topping.filter(
      (x) => x.subparameterId == selectedsize[0].subparameterId
    );
  let selectedoption =
    selectedtopping != undefined &&
    selectedtopping.length > 0 &&
    selectedtopping[0].list.filter((x) => x.optionselected == true);
  let defaultselected =
    selectedoption != undefined &&
    selectedoption.length > 0 &&
    selectedoption[0].type.filter((x) => x.defaultSelection != null);
  let categoryname =
    defaultselected != undefined &&
    defaultselected.length > 0 &&
    defaultselected[0].defaultSelection;
  let lstcategory =
    categoryname != undefined &&
    selectedoption != undefined &&
    selectedoption.length > 0 &&
    selectedoption[0].type.filter(
      (x) => x.suboptioncategoryname === categoryname
    );
  let cart = useSelector(({ cart }) => cart);
  let sessionid = useSelector(({ session }) => session?.sessionid);
  let cartdata = cart?.cartitemdetail && cart?.cartitemdetail;
  let cartcount = cart?.cartitemcount && cart.cartitemcount;
  let rewardpoint = cart?.rewardpoints && cart.rewardpoints;
  // console.log("cart count",cartcount);
  let Total = cart?.carttotal && cart.carttotal;
  let carttotal = Total?.subTotal;
  // let Total=cartdata?.
  const deliveryaddressinfo = useSelector(
    ({ selecteddelivery }) => selecteddelivery
  );
  let objrestaurant = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail
  );
  const { restaurantURL } = objrestaurant;
  let objselectedItem = useSelector(
    ({ menuitem }) => menuitem.selectedmenuitemdetail
  );
  let quantity = useSelector(({ menuitem }) => menuitem.selecteditemquantity);
  // let cartsessionid =
  //   restaurantinfo &&
  //   userinfo &&
  //   getSessionKey(
  //     restaurantinfo.restaurantId,
  //     userinfo && userinfo.customerId,
  //     restaurantinfo.defaultlocationId
  //   );
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail
  );
  const location = restaurantinfo.defaultLocation;

  const [showLogin, setShowLogin] = useState(false);
  const [updateCart, setUpdateCart] = useState(0);

  useEffect(() => {
    let rpoint = 0;
    let ramount = 0;
    if (rewardpoint?.redeemPoint) {
      rpoint = rewardpoint.redeemPoint > 0 ? rewardpoint.redeemPoint : 0;
    }
    if (rewardpoint?.rewardvalue && rpoint > 0) {
      ramount = rpoint / rewardpoint.rewardvalue;
    }

    if (sessionid !== undefined) {
      dispatch(
        getCartItemCount(
          sessionid,
          restaurantinfo.defaultlocationId,
          restaurantinfo.restaurantId,
          customerId
        )
      );
      dispatch(
        getCartItem(
          sessionid,
          restaurantinfo.defaultlocationId,
          restaurantinfo.restaurantId,
          0,
          customerId,
          rpoint,
          ramount,
          0,
          0,
          0
        )
      );
    }
  }, [cartcount, carttotal]);

  useEffect(() => {
    let ctop = [];
    selectedtopping != undefined &&
      selectedtopping.length > 0 &&
      selectedtopping[0].list != undefined &&
      selectedtopping[0].list.length > 0 &&
      selectedtopping[0].list.map((lsttop) => {
        lsttop.type != undefined &&
          lsttop.type.length > 0 &&
          lsttop.type.map((type) => {
            if (type.subOptionselected === true) {
              ctop.push(type);
            }
          });
      });
    setlstcarttopping(ctop);
  }, []);
  //   const selectedItemClick = (item) => {
  //     console.log(item.menuitemid)
  //     if (item != undefined) {
  //         dispatch(selectedMenuItem(item));
  //         dispatch(getMenuItemList(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, 0, item.menuitemid));
  //         setTimeout(() => {
  //         }, 500);
  //     }
  // }

  const selectedItemClick = (item, menucategoryitem, menuitemnameurl) => {
    if (item != undefined) {
      dispatch(
        getMenuItemList(
          restaurantinfo.restaurantId,
          restaurantinfo.defaultlocationId,
          0,
          item.menuitemid
        )
      );
      dispatch(selectedMenuItem(item));
      if (item.isdefaultprice === true && item.pricetypeid === 0) {
        router.push("/" + dynamic + "/" + menucategoryitem);
      } else {
        router.push(
          "/" + dynamic + "/" + menucategoryitem + "/" + menuitemnameurl
        );
      }
    }
  };

  let fsum = 0;
  lstcarttopping != undefined &&
    lstcarttopping.length > 0 &&
    lstcarttopping.map((data) => {
      fsum =
        fsum +
        (data.pizzaside === "L" || data.pizzaside === "R"
          ? data.price * 0.5
          : data.price) *
          data.subOptionToppingQuantity;
    });
  let total =
    selectedsize != undefined &&
    selectedsize.length > 0 &&
    selectedsize[0].price + fsum;
  let nettotal = total * quantity;

  const logindetailclick = () => {
    if (userinfo === undefined || userinfo === null) {
      sendDataToParent(true);
    } else {
      sendDataToParent(false);
    }
  };

  // const IsOrderDisable = () => {
  //   if (location && location.isOrderingDisable == true) {
  //     return (
  //       <h5 className="size_22 color_red weight_300 margin_bottom_20">
  //         {" "}
  //         {location.orderingMessage && location.orderingMessage}{" "}
  //       </h5>
  //     );
  //   } else {
  //     if (
  //       deliveryaddressinfo &&
  //       deliveryaddressinfo.pickupordelivery === "Pickup" &&
  //       location.isTakeoutOrderingDisable === true
  //     ) {
  //       return (
  //         <h5 className="size_22 color_red weight_300 margin_bottom_20">
  //           {" "}
  //           {location.orderingMessage && location.orderingMessage}{" "}
  //         </h5>
  //       );
  //     } else if (
  //       deliveryaddressinfo &&
  //       deliveryaddressinfo.pickupordelivery === "Delivery" &&
  //       location.isDeliveryOrderingDisable === true
  //     ) {
  //       return (
  //         <h5 className="size_22 color_red weight_300 margin_bottom_20">
  //           {" "}
  //           {location.orderingMessage && location.orderingMessage}{" "}
  //         </h5>
  //       );
  //     } else {
  //       return userinfo !== undefined && userinfo != null ? (
  //         <a className="blue_btn size_22">Go to cart</a>

  //       ) : (
  //         <a
  //           className="blue_btn size_22"
  //           data-toggle="modal"
  //           data-target="#myModal-logintest"
  //           onClick={() => logindetailclick()}
  //         >
  //           Go to cart
  //         </a>
  //       );
  //     }
  //   }
  // };

  const logindetailsclick = () => {
    if (userinfo === undefined || userinfo === null) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  };
  const gotoCartclick=()=>{
    router.push("/" + dynamic + "/"+"cartitems")
  }

  const addtocartclick = () => {
    if (
      deliveryaddressinfo &&
      (deliveryaddressinfo.pickupordelivery === "Pickup" ||
        (deliveryaddressinfo.pickupordelivery === "Delivery" &&
          deliveryaddressinfo.selecteddeliveryaddress &&
          deliveryaddressinfo.selecteddeliveryaddress != null))
    ) {
      let selectedoption =
        selectedtopping.length > 0 &&
        selectedtopping[0].list.filter((x) => x.isCompulsory == true);

      if (
        menuItemDetail.topping != undefined &&
        menuItemDetail.topping.length === 0
      ) {
        let itemobj = FormatOrderObject(
          objrestaurant,
          objselectedItem,
          menuItemDetail,
          customerId,
          total,
          quantity,
          sessionid
        );
        if (itemobj != undefined) {
          MenuItemServices.addItemToCart(
            itemobj,
            objrestaurant.restaurantId
          ).then((response) => {
            if (response) {
              dispatch({
                type: MenuItemTypes.ADD_ITEM_TO_CART,
                payload: response,
              });

              dispatch(updateCartItem());
              dispatch(updateCartItemCount());

              setUpdateCart(Math.random());
              // let dcart = [];
              // let cdetail = cartdata;
              // cartdata.cartdata.cartDetails.cartItemDetails.map((data) => {
              //     if (data.cartid !== item.cartid) {
              //         // data.qty = plusState;
              //         // data.totalprice = data.unitprice * data.qty;
              //         dcart.push(item);
              //     }

              // });
              // cdetail.cartdata.cartDetails.cartItemDetails = dcart;

              //dispatch(updateCartItem());
              // dispatch(setCartItem(cdetail.cartdata));

              // dispatch(updateCartItemCount());
              // dispatch(
              //   getCartItemCount(
              //     cartsessionid,
              //     objrestaurant.defaultlocationId,
              //     objrestaurant.restaurantId,
              //     customerId
              //   )
              // );

              //   dispatch(getCartItem(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, 0, userinfo.customerId, 0, 0,
              //     deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));
              // dispatch(getCartItemCount(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, userinfo.customerId));
            }
          });
        }
      } else if (
        menuItemDetail.topping != undefined &&
        menuItemDetail.topping.length > 0 &&
        selectedoption.length > 0
      ) {
        let result = [];
        for (var i = 0; i < selectedoption.length; i++) {
          if (
            selectedoption[i].type != undefined &&
            selectedoption[i].type.length > 0 &&
            selectedoption[i].type.filter((x) => x.subOptionselected === true)
              .length === 0
          ) {
            handleNotify(
              "Please select atleast one item in " + selectedoption[i].name,
              ToasterPositions.BottomRight,
              ToasterTypes.Error
            );
            result.push({ value: i, text: false });
            break;
          } else {
            result.push({ value: i, text: true });
          }
        }
        if (
          result.length > 0 &&
          result.filter((x) => x.text == false).length === 0
        ) {
          let itemobj = FormatOrderObject(
            objrestaurant,
            objselectedItem,
            menuItemDetail,
            customerId,
            total,
            quantity,
            sessionid
          );
          if (itemobj != undefined) {
            MenuItemServices.addItemToCart(
              itemobj,
              objrestaurant.restaurantId
            ).then((response) => {
              if (response) {
                dispatch({
                  type: MenuItemTypes.ADD_ITEM_TO_CART,
                  payload: response,
                });
                dispatch(updateCartItemCount());
                dispatch(
                  getCartItemCount(
                    sessionid,
                    objrestaurant.defaultlocationId,
                    objrestaurant.restaurantId,
                    customerId
                  )
                );
              }
            });
          }
        }
      } else if (
        menuItemDetail.topping != undefined &&
        menuItemDetail.topping.length > 0 &&
        selectedoption.length === 0
      ) {
        let itemobj = FormatOrderObject(
          objrestaurant,
          objselectedItem,
          menuItemDetail,
          customerId,
          total,
          quantity,
          sessionid
        );
        if (itemobj != undefined) {
          MenuItemServices.addItemToCart(
            itemobj,
            objrestaurant.restaurantId
          ).then((response) => {
            if (response) {
              dispatch({
                type: MenuItemTypes.ADD_ITEM_TO_CART,
                payload: response,
              });
              dispatch(updateCartItemCount());
              dispatch(
                getCartItemCount(
                  sessionid,    
                  objrestaurant.defaultlocationId,
                  objrestaurant.restaurantId,
                  customerId
                )
              );
            }
          });
        }
      }
    } else {
      
      handleNotify(
        "Please choose delivery address",
        ToasterPositions.BottomRight,
        ToasterTypes.Error
      );
    }
  };
  const handleClickDelete = () => {
    // let cartsessionid =
    //   restaurantinfo &&
    //   userinfo &&
    //   getSessionKey(
    //     restaurantinfo.restaurantId,
    //     userinfo && userinfo.customerId,
    //     restaurantinfo.defaultlocationId
    //   );

    CartServices.deleteCartItem(
      sessionid,
      deleteitem.cartid,
      restaurantinfo.restaurantId,
      restaurantinfo.defaultlocationId
    ).then((response) => {
      if (response) {
        dispatch({ type: CartTypes.DELETE_CART_ITEM, payload: response });
        dispatch(updateCartItem());
        dispatch(updateCartItemCount());
        dispatch(
          getCartItem(
            sessionid,
            restaurantinfo.defaultlocationId,
            restaurantinfo.restaurantId,
            0,
            // userinfo && userinfo.customerId,
            customerId,
            0,
            0,
            0,
            0,
            0
          )
        );

        dispatch(
          getCartItemCount(
            sessionid,
            restaurantinfo.defaultlocationId,
            restaurantinfo.restaurantId,
            customerId
          )
        );
      }
    });
    //
    setcartdeleteconfirm(false);
  };
  const deletecartclick = (item) => {
    if (item != undefined) {
      setcartdeleteconfirm(true);
      setdeleteitem(item);
    }
  };
  if(cartdata?.cartDetails?.cartItemDetails.length > 0){
    return (
      <>
        <div className="col-lg-3 rt-s flush col-sm-12 col-xs-12 mt-5">
          {/* {selectedsize.length > 0 && */}
          <div className="col-lg-12 col-sm-12 col-xs-12 flush">
            <div className="col-lg-12 bg_total col-sm-12 col-xs-12 mini-cart">
              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <h3 className="color_black size_22 weight_600 margin_bottom_15">
                  TOTAL
                </h3>
              </div>
              {cartdata.cartDetails != undefined &&
                cartdata.cartDetails.cartItemDetails.length > 0 &&
                cartdata.cartDetails.cartItemDetails.map((data, index) => {
                  return (
                    <div key={index}>
                      <div
                        className="col-lg-12 flush col-sm-12 col-xs-12"
                        key={index}
                      >
                        <div className="col-lg-6 col-sm-6 col-xs-6">
                          <p className="size_16 margin_0 margin_bottom_10">
                            {data.itemname}{" "}
                            {`(${data.currencysymbol} ${data.unitprice?.toFixed(
                              2
                            )})`}
                          </p>
                          {/* <p className="size_16 margin_0 margin_bottom_10"> */}
                          {/* {cartdata.cartDetails.cartOptionParams
                            .filter((x) => x.cartid === data.cartid)
                            .map((option, index) => {
                              return (
                                <p key={index} className="size_16 margin_0 margin_bottom_10">
                                  {option.quantity}
                                  {" x "}
                                  {option.title}
                                  {option.pizzaside === "" ||
                                  option.pizzaside === "F"
                                    ? ""
                                    : option.pizzaside === "L"
                                    ? " (Left)"
                                    : " (Right)"}
                                  {cartdata.cartDetails.cartOptionParams.filter(
                                    (x) => x.cartid === data.cartid
                                  ).length -
                                    1 ==
                                  index
                                    ? ""
                                    : ",  "}
                                </p>
                              );
                            })} */}
                        </div>
                        <div className="col-lg-1 text-left col-sm-2 col-xs-2">
                          <p className="size_16 margin_0 margin_bottom_10">
                            <span className="color_black size_16 float_none weight_300">
                              {data.qty}
                            </span>
                          </p>
                        </div>
                        <div className="col-lg-2 text-right flush col-sm-3 col-xs-3">
                          <p className="size_16 margin_0 margin_bottom_10">
                            <span className="color_black size_16 float_none weight_300">
                              {data.currencysymbol}
                              {data.totalprice.toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <div className="col-lg-2 text-right col-sm-2 col-xs-2 padding_0">
                          <p className="size_16 margin_0 margin_bottom_10">
                            <span className="color_black size_16 float_none weight_300">
                              <a
                                className="close-red color_red d-inline-block v-middle margin_left_5"
                                data-dismiss="modal"
                                data-toggle="modal"
                                data-target="#cartdeleteconfirmmodel"
                                onClick={() => deletecartclick(data)}
                              >
                                <i className="fa fa-close" />
                              </a>
                              <a
                                onClick={() =>
                                  selectedItemClick(
                                    data,
                                    data.categoryname
                                      .toLowerCase()
                                      .toString()
                                      .replace(/ /g, "-"),
                                    data.itemname
                                      .toLowerCase()
                                      .toString()
                                      .replace(/ /g, "-")
                                  )
                                }
                                style={{ cursor: "pointer !important" }}
                                className="d-inline-block v-middle margin_left_5"
                              >
                                <i
                                  className="fa fa-pencil"
                                  style={{ color: "#3A86F3" }}
                                ></i>{" "}
                              </a>
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        {cartdata.cartDetails.cartOptionParams
                          .filter((x) => x.cartid === data.cartid)
                          .map((option, index) => {
                            return (
                              <small key={index}>
                                {index === 0 && `(`}
                                {option.title}
                                {cartdata.cartDetails.cartOptionParams.filter(
                                  (x) => x.cartid === data.cartid
                                ).length -
                                  1 ==
                                index
                                  ? ")"
                                  : ",  "}
                              </small>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              <div className="col-lg-12 col-sm-12 col-xs-12">
                <hr className="margin_0 margin_top_15 full float_left grey_border margin_bottom_25" />
              </div>

              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                {userinfo != undefined && userinfo != null && cartcount > 0 && (
                  <div className="row">
                    <div className="col-lg-6 col-sm-6 col-xs-12 text-right">
                      <h6 className="line_height_1_5 margin_0 size_22">
                        Total :
                      </h6>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-xs-12 text-right">
                      <h6 className="color_grey line_height_1_5 margin_0 ">
                        <span className="color_orange size_22 weight_300">
                          {/* {selectedsize.length > 0 &&  <>{selectedsize[0]?.currency} {total && total.toFixed(2)}</>}
                      0 */}
                          {Total.currencySymbol} {Total.subTotal?.toFixed(2)}
                        </span>
                      </h6>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-lg-12 margin_top_15 col-sm-12 col-xs-12">
                  <IsOrderDisable buttonname="Go to cart" buttonclick={gotoCartclick} loginclick={logindetailclick} />
              </div>
            </div>
          </div>
          {/* } */}
          {showLogin === true && (
            <LoginMainComponent restaurantinfo={restaurantinfo} />
          )}
        </div>

        {cartdeleteconfirm === true && (
          <div
            id="cartdeleteconfirmmodel"
            className="modal address fade"
            role="dialog"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      <img src="/images/close.svg" alt="" />
                    </button>
                    <h3>Delete item</h3>
                  </div>
                  <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                    <form className="customForm">
                      <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                        <p>
                          Are you sure you want to delete this item?
                          <br /> This may affect your item in cart. You might
                          need to add items again.
                        </p>
                      </div>
                      <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">
                        <a
                          className="light_orange_btn margin_bottom_20 margin_right_10"
                          data-dismiss="modal"
                          data-toggle="modal"
                          onClick={handleClickDelete}
                        >
                          Confirm
                        </a>
                        <a
                          className="light_orange_btn margin_bottom_20 margin_left_10"
                          data-dismiss="modal"
                        >
                          Cancel
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
        }
        else{
          return <></>
        }

}

export default MenuCategoryCart;
