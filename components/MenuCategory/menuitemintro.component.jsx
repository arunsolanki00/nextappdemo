
import Link from 'next/link';
import NumberFormat from 'react-number-format';
import { useRouter } from "next/router"
import { addFavorite, deleteFavorite, getMenuItemList, selectedMenuItem } from '../../redux/menu-item/menu-item.action';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getCategoryItemList, removeCategoryList, setCategoryList } from '../../redux/category/category.action';
import { useState } from 'react';
import LoginMainComponent from '../login/login.component';
import { GetCurrency } from '../helpers/utility';

function MenuItemIntroComponent({ menuitems }) {

    const router = useRouter()
    const dispatch = useDispatch();
    const {
        query: { dynamic, id, category, index },
    } = router

    const slides = [];
    const [currency, setcurrency] = useState(GetCurrency())
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const [showLogin, setShowLogin] = useState(false);

    const selectedItemClick = (item) => {
        if (item != undefined) {
            dispatch(selectedMenuItem(item));
            dispatch(getMenuItemList(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, 0, item.menuitemId));
        }
    }

    const logindetailsclick = () => {
        if (userinfo === undefined || userinfo === null) {
            setShowLogin(true);
        }
        else {
            setShowLogin(false);
        }
    }

    const selectedFavoriteClick = (selecteditem, item) => {
        selecteditem.isFavoriteMenu = item;
        menuitems.map((data) => {
            if (data.menuitemId === selecteditem.menuitemId)
                data = selecteditem;
            else
                data = data;
        })
        if (item === true) {
            dispatch(removeCategoryList());
            dispatch(setCategoryList(menuitems));
            dispatch(addFavorite(userinfo.customerId.toString(), restaurantinfo.restaurantId, selecteditem.menuitemId));
        }
        else {
            dispatch(removeCategoryList());
            dispatch(setCategoryList(menuitems));
            dispatch(deleteFavorite(userinfo.customerId, restaurantinfo.restaurantId, selecteditem.menuitemId));
        }
    }

    if (menuitems) {
        for (let i = 0; i < menuitems.length; i += 2) {
            const evenMenuItem = menuitems[i];
            const oddMenuItem = menuitems[i + 1];
            slides.push(
                <div className="row row-eq-height" key={Math.random()}>
                    {evenMenuItem ?
                        <div className="col-lg-6 s-piza b-right b-bottom col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-lg-4 flush-right text-center col-sm-4 col-xs-12">
                                    <img src={evenMenuItem.imgurl} className="itemimage" alt="" />
                                </div>
                                <div className="col-lg-8 col-sm-8 col-xs-12" style={{cursor:"pointer !important"}}>
                                    <Link
                                        // prefetch={false}
                                        shallow={false}
                                        // scroll={false}
                                        key={Math.random()} href="/[dynamic]/[category]/[items]"
                                        as={`${window.location.origin + router.asPath}/${evenMenuItem.menuItemName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>
                                        <a onClick={() => selectedItemClick(evenMenuItem)}  style={{cursor:"pointer !important"}}>
                                            <div className="itembox">
                                                <div className="tablerow">
                                                    <div className="tablecell">
                                                        <h3 className="color_black margin_bottom_10">{evenMenuItem.menuItemName}</h3>
                                                        <p>{evenMenuItem.description}</p>
                                                        <span className="fa angle size_15 angle-round bg_green color_white fa-angle-right"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 text-right col-sm-12 col-xs-12" style={{cursor:"pointer !important"}}>
                                    <div className="col-sm-3">
                                        {evenMenuItem.MenuStausList && evenMenuItem.MenuStausList.length > 0 &&
                                            evenMenuItem.MenuStausList.map((item,index) => {
                                                return (
                                                    <span key={index}>
                                                        <img src={item.iconurl}></img>&nbsp;&nbsp;
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                    {(userinfo != undefined && userinfo != null) &&
                                        <a className={"orange_btn remove-hover remove-bg"} onClick={() => selectedFavoriteClick(evenMenuItem, !evenMenuItem.isFavoriteMenu)}>
                                            <i className={evenMenuItem.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"}></i> Favourites
                                        </a>}
                                    {(userinfo === undefined || userinfo === null) &&
                                        <a className={"orange_btn remove-hover remove-bg"}
                                            onClick={() => logindetailsclick()}
                                            data-toggle="modal"
                                            data-target="#myModal-logintest">
                                            <i className={evenMenuItem.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"}></i> Favourites
                                        </a>}
                                    {/* <span className="cls">~ {evenMenuItem.calories} Cals</span> */}
                                    <NumberFormat className="orange_price_btn"
                                        value={evenMenuItem.menuItemPrice != undefined ? evenMenuItem.menuItemPrice : ""}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={currency}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </div>
                            </div>
                        </div>
                        : ''}
                    {oddMenuItem ?
                        <div className="col-lg-6 s-piza b-bottom col-sm-12 col-xs-12"  style={{cursor:"pointer !important"}}>
                            <div className="row">
                                <div className="col-lg-4 flush-right text-center col-sm-4 col-xs-12">
                                    <img src={oddMenuItem.imgurl} className="itemimage" alt="" />
                                </div>
                                {/* <div className="col-lg-8 col-sm-8 col-xs-12">
                                    <div className="itembox">
                                        <div className="tablerow">
                                            <div className="tablecell">
                                                <h3 className="color_black margin_bottom_10">{oddMenuItem.menuItemName}</h3>
                                                <p>{oddMenuItem.description}</p>
                                                <Link
                                                    shallow={false}
                                                    key={Math.random()} href="/[dynamic]/[category]/[items]"
                                                    as={`${window.location.origin + router.asPath}/${oddMenuItem.menuItemName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>
                                                    <a className="fa angle size_15 angle-round bg_green color_white fa-angle-right" onClick={() => selectedItemClick(oddMenuItem)}></a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-lg-8 col-sm-8 col-xs-12" >
                                    <Link
                                        shallow={false}
                                        key={Math.random()} href="/[dynamic]/[category]/[items]"
                                        as={`${window.location.origin + router.asPath}/${oddMenuItem.menuItemName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}
                                        >
                                        <a onClick={() => selectedItemClick(oddMenuItem)} style={{cursor:"pointer !important"}}>
                                            <div className="itembox">
                                                <div className="tablerow">
                                                    <div className="tablecell">
                                                        <h3 className="color_black margin_bottom_10">{oddMenuItem.menuItemName}</h3>
                                                        <p>{oddMenuItem.description}</p>
                                                        <span className="fa angle size_15 angle-round bg_green color_white fa-angle-right"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>

                            </div>
                            <div className="row tps">
                                <div className="col-lg-12 text-right col-sm-12 col-xs-12">
                                    <div className="col-sm-3">
                                        {oddMenuItem.MenuStausList && oddMenuItem.MenuStausList.length > 0 &&
                                            oddMenuItem.MenuStausList.map((item,index) => {
                                                return (
                                                    <span key={index}>
                                                        <img src={item.iconurl}></img>&nbsp;&nbsp;
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                    {(userinfo != undefined && userinfo != null) &&
                                        <a className={"orange_btn remove-hover remove-bg"} onClick={() => selectedFavoriteClick(oddMenuItem, !oddMenuItem.isFavoriteMenu)}>
                                            <i className={oddMenuItem.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"}></i> Favourites
                                        </a>}
                                    {(userinfo === undefined || userinfo === null) &&
                                        <a className={"orange_btn remove-hover remove-bg"}
                                            onClick={() => logindetailsclick()}
                                            data-toggle="modal"
                                            data-target="#myModal-logintest">
                                            <i className={oddMenuItem.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"}></i> Favourites
                                        </a>
                                    }
                                    {/* <span className="cls">~ {oddMenuItem.calories} Cals</span> */}
                                    <NumberFormat className="orange_price_btn"
                                        value={oddMenuItem.menuItemPrice != undefined ? oddMenuItem.menuItemPrice : ""}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={currency}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                    {/* <a className="orange_price_btn" href="#">$12.99</a> */}
                                </div>
                            </div>
                        </div>
                        : ''}
                </div>
            );
        }
    }
    return (
        <>
            {slides}
            {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
        </>
    )
}

export default MenuItemIntroComponent
