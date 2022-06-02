import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getCartItem, getCartItemCount, updateCartItemCount } from "../../../redux/cart/cart.action";
import { removeMenuItem, selectedItemSize, updateitemoption } from "../../../redux/menu-item/menu-item.action";
import { getSessionKey } from "../../Common/auth";
import { FormatOrderObject } from "../../Common/format-order-object";
import Loader from "../../Common/loader/loader.component";
import handleNotify from "../../helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../helpers/toaster/toaster-types";
import { MenuItemServices } from "../../../redux/menu-item/menu-item.services";
import { MenuItemTypes } from "../../../redux/menu-item/menu-item.types";
import { IsOrderDisable } from "../../Common/custom/isorderdisable.component";

const MenuItemAddToCartComponent = ({ ctopping, sendDataToParent }) => {
	const [count, setcount] = useState(Math.random)
	const dispatch = useDispatch();
	const [lstcarttopping, setlstcarttopping] = useState([]);
	const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
	const customerId = userinfo ? userinfo.customerId : 0;
	const selectedCategory = useSelector(({ category }) => category.selectedcategorydetail, shallowEqual);
    const mainCategory = useSelector(({ main }) => main.maincategoryList, shallowEqual);
	let sessionid = useSelector(({ session }) => session?.sessionid);
	let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
	let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.filter(x => x.sizeselected == true);
	let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.filter(x => x.subparameterId == selectedsize[0].subparameterId);
	let selectedoption = selectedtopping != undefined && selectedtopping.length > 0 && selectedtopping[0].list.filter(x => x.optionselected == true);
	let defaultselected = selectedoption != undefined && selectedoption.length > 0 && selectedoption[0].type.filter(x => x.defaultSelection != null);
	let categoryname = defaultselected != undefined && defaultselected.length > 0 && defaultselected[0].defaultSelection;
	let lstcategory = categoryname != undefined && selectedoption != undefined && selectedoption.length > 0 && selectedoption[0].type.filter(x => x.suboptioncategoryname === categoryname);
	const deliveryaddressinfo = useSelector(({ selecteddelivery }) => selecteddelivery);

	let objrestaurant = useSelector(({ restaurant }) => restaurant.restaurantdetail);
	let objselectedItem = useSelector(({ menuitem }) => menuitem.selectedmenuitemdetail);
	let quantity = useSelector(({ menuitem }) => menuitem.selecteditemquantity);
	const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
	const location = restaurantinfo.defaultLocation;
	let updateitemoptionincart = useSelector(({ menuitem }) => menuitem.updateitemoptionincart);

	useEffect(() => {
		let ctop = [];
		selectedtopping != undefined && selectedtopping.length > 0 && selectedtopping[0].list != undefined && selectedtopping[0].list.length > 0 &&
			selectedtopping[0].list.map((lsttop) => {
				lsttop.type != undefined && lsttop.type.length > 0 &&
					lsttop.type.map((type) => {
						if (type.subOptionselected === true) {
							ctop.push(type);
						}
					})
			})
		setlstcarttopping(ctop);
	}, [ctopping,updateitemoptionincart])
	// useEffect(()=>{

	// },[ctopping])

	let fsum = 0;
	lstcarttopping != undefined && lstcarttopping.length > 0 &&
		lstcarttopping.map((data) => {
			fsum = fsum + ((data.pizzaside === "L" || data.pizzaside === "R") ? data.price * 0.5 : data.price) * data.subOptionToppingQuantity;
		});
	let total = selectedsize != undefined && selectedsize.length > 0 &&
		selectedsize[0].price + fsum;
	let nettotal = total * quantity;

	const logindetailclick = () => {
		if (userinfo === undefined || userinfo === null) {
			sendDataToParent(true);
		}
		else {
			sendDataToParent(false);
		}
	}



	const addtocartclick = () => {
		 
		// if (deliveryaddressinfo && (
		// 	deliveryaddressinfo.pickupordelivery === "Pickup" ||
		// 	(deliveryaddressinfo.pickupordelivery === "Delivery" &&
		// 		deliveryaddressinfo.selecteddeliveryaddress && deliveryaddressinfo.selecteddeliveryaddress != null))) {
			if (deliveryaddressinfo && (
				deliveryaddressinfo.pickupordelivery === "Pickup" ||
				(deliveryaddressinfo.pickupordelivery === "Delivery"))) {
			let selectedoption = selectedtopping.length > 0 && selectedtopping[0].list.filter(x => x.isCompulsory == true);
			// const cartsessionid = getSessionKey(objrestaurant.restaurantId, customerId, objrestaurant.defaultlocationId);

			if (menuItemDetail.topping != undefined && menuItemDetail.topping.length === 0) {
				let itemobj = FormatOrderObject(objrestaurant, objselectedItem, menuItemDetail, customerId, total, quantity,sessionid);
				if (itemobj != undefined) {
					MenuItemServices.addItemToCart(itemobj, objrestaurant.restaurantId).then(response => {
						if (response) {
							dispatch({ type: MenuItemTypes.ADD_ITEM_TO_CART, payload: response });
							dispatch(updateCartItemCount());
							dispatch(getCartItemCount(sessionid, objrestaurant.defaultlocationId, objrestaurant.restaurantId, customerId));
						}
					})
				}
			}
			else if (menuItemDetail.topping != undefined && menuItemDetail.topping.length > 0 && selectedoption.length > 0) {
				let result = [];
				for (var i = 0; i < selectedoption.length; i++) {
					if (selectedoption[i].type != undefined && selectedoption[i].type.length > 0 && selectedoption[i].type.filter(x => x.subOptionselected === true).length === 0) {
						handleNotify('Please select atleast one item in ' + selectedoption[i].name, ToasterPositions.TopRight, ToasterTypes.Error);
						result.push({ value: i, text: false });
						break;
					}
					else {
						result.push({ value: i, text: true });
					}
				}
				if (result.length > 0 && result.filter(x => x.text == false).length === 0) {
					let itemobj = FormatOrderObject(objrestaurant, objselectedItem, menuItemDetail, customerId, total, quantity,sessionid);
					if (itemobj != undefined) {
						MenuItemServices.addItemToCart(itemobj, objrestaurant.restaurantId).then(response => {
							if (response) {
								dispatch({ type: MenuItemTypes.ADD_ITEM_TO_CART, payload: response });
								dispatch(updateCartItemCount());
								dispatch(getCartItemCount(sessionid, objrestaurant.defaultlocationId, objrestaurant.restaurantId, customerId));
							}
						})
					}
				}
			}
			else if (menuItemDetail.topping != undefined && menuItemDetail.topping.length > 0 && selectedoption.length === 0) {
				let itemobj = FormatOrderObject(objrestaurant, objselectedItem, menuItemDetail, customerId, total, quantity,sessionid);
				if (itemobj != undefined) {
					MenuItemServices.addItemToCart(itemobj, objrestaurant.restaurantId).then(response => {
						if (response) {
							dispatch({ type: MenuItemTypes.ADD_ITEM_TO_CART, payload: response });
							dispatch(updateCartItemCount());
							dispatch(getCartItemCount(sessionid, objrestaurant.defaultlocationId, objrestaurant.restaurantId, customerId));
						}
					})
				}
			}
		}
		else {
			
			handleNotify('Please choose delivery address', ToasterPositions.TopRight, ToasterTypes.Error);
		}
	}

	const onRemoveClick = (item) => {
		if (item != undefined) {
			let lsttopping = [];
			selectedtopping != undefined && selectedtopping.length > 0 && selectedtopping[0].list != undefined && selectedtopping[0].list.length > 0 &&
				selectedtopping[0].list.map((lsttop) => {
					let lsttype = [];
					lsttop.type != undefined && lsttop.type.length > 0 &&
						lsttop.type.map((data) => {
							if (item.name === data.name && data.subOptionselected === true) {
								data.subOptionselected = false;
								data.subOptionToppingQuantity = 0;
							}

							lsttype.push(data);
						})
					let lstobj = {
						displayStatus: lsttop.displayStatus,
						isCompulsory: lsttop.isCompulsory,
						isHalfPizza: lsttop.isHalfPizza,
						maxSelection: lsttop.maxSelection,
						multipleSelectStatus: lsttop.multipleSelectStatus,
						name: lsttop.name,
						optionId: lsttop.optionId,
						optionselected: lsttop.optionselected,
						priceStatus: lsttop.priceStatus,
						selectAllStatus: lsttop.selectAllStatus,
						subparameterId: lsttop.subparameterId,
						toppingPriceForHalfPizza: lsttop.toppingPriceForHalfPizza,
						toppingValue: lsttop.toppingValue,
						type: lsttype
					}
					lsttopping.push(lstobj);
				})

			let objtopping = { subparameterId: selectedtopping[0].subparameterId, list: lsttopping }

			menuItemDetail.topping.map((data) => {
				if (data.subparameterId === selectedsize[0].subparameterId)
					data = objtopping;
				else
					data = data;
			})
			dispatch(removeMenuItem());
			dispatch(selectedItemSize(menuItemDetail));
			dispatch(updateitemoption());
		}
	}


	if (lstcarttopping != undefined && selectedsize != undefined && selectedsize != false && total != NaN && nettotal != NaN)
		return (
			<>
				<div className="col-lg-12 col-sm-12 col-xs-12 flush">
					<div className="col-lg-12 bg_total col-sm-12 col-xs-12">
						<div className="col-lg-12 text-center col-sm-12 col-xs-12">
							<h3 className="color_black size_22 weight_600 margin_bottom_15">TOTAL</h3>
						</div>
						<div className="col-lg-12 flush col-sm-12 col-xs-12">
							{lstcarttopping && lstcarttopping.map((data, index) => {
								return (
									<div key={Math.random()}>
										<div className="col-lg-8 col-sm-7 col-xs-7">
											<p className="size_16 margin_0 margin_bottom_10">{data.subOptionToppingQuantity}{' x '}{data.name}{data.pizzaside === "" || data.pizzaside === "F" ? "" : (data.pizzaside === "L" ? " (Left)" : " (Right)")}</p>
										</div>
										{/* <div className="col-lg-2 text-right flush col-sm-3 col-xs-3">
											<p className="size_16 margin_0 margin_bottom_10"><span className="color_black size_16 float_none weight_300">{data.currency}{(data.pizzaside === "L" || data.pizzaside === "R") ? (0.5 * data.price).toFixed(2) : data.price.toFixed(2)}</span></p>
										</div> */}
																					<div className="col-lg-2 text-right flush col-sm-3 col-xs-3">
												<p className="size_16 margin_0 margin_bottom_10"><span className="color_black size_16 float_none weight_300">{data.currency}{(data.pizzaside === "L" || data.pizzaside === "R") ? (0.5 * data.price).toFixed(2) : data.price.toFixed(2)}</span></p>
											</div>

											<div className="col-lg-2 text-right flush-left col-sm-2 col-xs-2">
												<p className="size_16 margin_0 margin_bottom_10"><span className="color_black size_14 float_none weight_300"><a className="close-red color_red d-inline-block v-middle margin_left_5" onClick={() => onRemoveClick(data)}><i className="fa fa-close"></i></a></span></p>
											</div>
									</div>
								)
							})}
						</div>
						<div className="col-lg-12 col-sm-12 col-xs-12">
							<hr className="margin_0 margin_top_15 full float_left grey_border margin_bottom_25" />
						</div>
						<div className="col-lg-12 text-center col-sm-12 col-xs-12">
							<div className="row">
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="line_height_1_5 margin_0 size_22">Size :</h6>
								</div>
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="color_grey line_height_1_5 margin_0 "><span className="color_orange size_22 weight_300"> {selectedsize[0].type}</span></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="line_height_1_5 margin_0 size_22">Total :</h6>
								</div>
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="color_grey line_height_1_5 margin_0 "><span className="color_orange size_22 weight_300"> {selectedsize[0].currency} {total && total.toFixed(2)}</span></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="line_height_1_5 margin_0 size_22">Quantity :</h6>
								</div>
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="color_grey line_height_1_5 margin_0 "><span className="color_orange size_22 weight_300"> {quantity}</span></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="line_height_1_5 margin_0 size_22">Net Total :</h6>
								</div>
								<div className="col-lg-6 col-sm-6 col-xs-12 text-right">
									<h6 className="color_grey line_height_1_5 margin_0 "><span className="color_orange size_22 weight_300"> {selectedsize[0].currency} {nettotal&& nettotal.toFixed(2)}</span></h6>
								</div>
							</div>
						</div>
						<div className="col-lg-12 margin_top_15 col-sm-12 col-xs-12">
							<IsOrderDisable buttonname="Add to cart" buttonclick={addtocartclick} loginclick={logindetailclick}/> 
							{/* <a className="blue_btn size_22"
                            onClick={() => addtocartclick()}>Add to cart</a> */}
						
						</div>
					</div>
				</div>
			</>
		)
	return null;
}

export default MenuItemAddToCartComponent;