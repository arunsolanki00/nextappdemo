
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MenuItemDescriptionData } from "./menu-item-description.data";
import { removeMenuItem, selectedItemSize, removeMenuItemForFavorite, selectedMenuItem, addFavorite, deleteFavorite, selecteditemquantity } from "../../../redux/menu-item/menu-item.action";
import { useEffect, useState } from "react";
import handleNotify from "../../helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../helpers/toaster/toaster-types";
import Head from "next/head";

const MenuItemDescription = () => {

	const dispatch = useDispatch();
	let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
	let selectedmenuitemdetail = useSelector(({ menuitem }) => menuitem.selectedmenuitemdetail);
	const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
	const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);

	const [currentQty, setcurrentQty] = useState(selectedmenuitemdetail.qty != undefined ? selectedmenuitemdetail.qty : 1);
	const [minQty, setminQty] = useState(1);
	const selectedSizeClick = (item) => {
		if (item != undefined) {
			let lstsizedata = [];
			menuItemDetail.size.map((data) => {
				if (data.type === item.type)
					data.sizeselected = true;
				else
					data.sizeselected = false;

				lstsizedata.push(data);
			});
			menuItemDetail.size = lstsizedata;
			dispatch(removeMenuItem());
			dispatch(selectedItemSize(menuItemDetail));
		}
	}

	const increment = () => {
		const plusState = currentQty + 1;
		setcurrentQty(plusState);
	};

	const decrement = () => {
		if (minQty === currentQty) {
			setcurrentQty(minQty);
			return;
		}
		const minusState = currentQty - 1;
		setcurrentQty(minusState);
	};

	const selectedFavoriteClick = (item) => {
		let objdata = selectedmenuitemdetail;
		objdata.isFavoriteMenu = item;
		dispatch(removeMenuItemForFavorite());
		dispatch(selectedMenuItem(objdata));

		if (item === true) {
			dispatch(addFavorite(userinfo.customerId.toString(), restaurantinfo.restaurantId, objdata.menuitemId != undefined ? objdata.menuitemId : objdata.menuitemid));
		}
		else {
			dispatch(deleteFavorite(userinfo.customerId, restaurantinfo.restaurantId, objdata.menuitemId != undefined ? objdata.menuitemId : objdata.menuitemid));
		}
	}

	useEffect(() => {
		console.log('Current Qty :' + currentQty);
		dispatch(selecteditemquantity(currentQty));
	}, [currentQty])

	return (
		<>
			<Head>
				<title>{restaurantinfo.restaurantname}: {menuItemDetail.itemName}</title>
				<meta name="description" content={menuItemDetail.description ? menuItemDetail.description : menuItemDetail.itemName} />
			</Head>
			<div>
				<div className="col-lg-3 flush-right text-center col-sm-3 col-xs-12">
					<div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
						<img src={menuItemDetail.image} alt="" />
					</div>
				</div>
				<div className="col-lg-9 col-sm-9 col-xs-12">
					<div className="row">
						<div className="col-lg-12 col-sm-12 col-xs-12">
							<p className="margin_bottom_10">{menuItemDetail.description}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-3 col-sm-3 col-xs-12 flush-right text-center">
					<div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
						<div className="quantity">
							<button onClick={decrement} className={currentQty > 1 ? "active" : "disabled"}>-</button>
							<input data-value type="text" readOnly value={currentQty} />
							<button onClick={increment} className="active">+</button>
						</div>
					</div>
				</div>
				<div className="col-lg-9 col-sm-9 col-xs-12">
					<div className="row">
						<div className="col-lg-12 flush col-sm-12 col-xs-12">
							<div className="col-lg-12 col-sm-12 col-xs-12">
								<h3 className="color_black margin_bottom_10">Select size</h3>
							</div>
							<div className="col-lg-12 col-sm-12 col-xs-12">
								{menuItemDetail && menuItemDetail != undefined && menuItemDetail != null &&
									menuItemDetail.size != undefined && menuItemDetail.size.map((item, index) => {

										let classname = "";
										if (item.textsize == "Medium") classname = "md";
										else if (item.textsize == "Large") classname = "lg";
										else if (item.textsize == "XL") classname = "xl";
										else if (item.textsize == "Small") classname = "sm";

										classname = classname + ' ' + (item.sizeselected == true ? 'active' : '');

										return (
											<div className="priceSize margin_bottom_15 text-center" key={Math.random()}>
												<a key={item.type} className={`grey_btn size_btn ` + classname} onClick={() => selectedSizeClick(item)} >{item.type}</a>
												<h6 className={"margin_right_15"}>{item.currency}{item.price.toFixed(2)}</h6>
											</div>
										)
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default MenuItemDescription;