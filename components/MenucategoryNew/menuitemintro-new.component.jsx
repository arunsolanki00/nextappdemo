
import Link from 'next/link';
import NumberFormat from 'react-number-format';
import { useRouter } from "next/router"
import { addFavorite, deleteFavorite, getMenuItemList, selecteditemquantity, selectedMenuItem } from '../../redux/menu-item/menu-item.action';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeCategoryList, setCategoryList } from '../../redux/category/category.action';
import { useEffect, useState } from 'react';
import LoginMainComponent from '../login/login.component';
import { GetCurrency } from '../helpers/utility';
import CartQuantityArea from './menucategory-cart-quantityarea.component';

function MenuItemIntroComponentNew() {
    const router = useRouter()
    const dispatch = useDispatch();
    const {
        query: { dynamic, id, index },
    } = router
    const [currency, setcurrency] = useState(GetCurrency())
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const [showLogin, setShowLogin] = useState(false);
    const selectedCategory = useSelector(({ category }) => category.selectedcategorydetail, shallowEqual);
    let cart = useSelector(({ cart }) => cart);
    let cartdetails = cart?.cartitemdetail?.cartDetails?.cartItemDetails;
    const menuitems = useSelector(({ category }) => category.categoryitemlist, shallowEqual);
    const slides = [];
    let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
    let selectedmenuitemdetail= useSelector(({ menuitem }) => menuitem.selectedmenuitemdetail)
    // const [reload, setreload] = useState()

    // useEffect(() => {
    //     setreload(Math.random())
    // }, [menuitems])
    useEffect(()=>{
        
        if(Object.keys(menuItemDetail).length === 0 ){
            
            dispatch(getMenuItemList(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, 0, selectedmenuitemdetail.menuitemId));
        }
    },[selectedmenuitemdetail]) 
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
    const selectedItemClick = (item) => {
        if (item != undefined) {
            dispatch(selectedMenuItem(item));
            dispatch(getMenuItemList(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, 0, item.menuitemId));

            setTimeout(() => {

            }, 1000);


        }
    }

    if (menuitems) {
        for (let i = 0; i < menuitems.length; i++) {
            const categories = menuitems[i];
            slides.push(
                <div key={i}>
                    {/* if price type == 0 then no option in menu item and if default price == 1 then no option in menu item */}

                    {(categories.typeid > 0 && categories.isdefaultprice === 0)
                        ? (
                            <div className="row">
                                <div className="col-lg-12 s-piza col-sm-12 col-xs-12">
                                    <div className="row">
                                        <div className="col-lg-4 flush-right text-center col-sm-4 col-xs-12">
                                            <a ><img src={categories.imgurl === "" ? "/images/work-in-progress.png" : categories.imgurl}  className="itemimage" alt="true" /></a>
                                        </div>
                                        <div className="col-lg-8 col-sm-8 col-xs-12">
                                            <div className="itembox">
                                                <div className="tablerow">
                                                    <div className="tablecell">
                                                        <h3 className="color_black margin_bottom_10">
                                                            {/* <a href="#">{categories.menuItemName} <span className="orange_btn remove-hover remove-bg fav">
                                                <i className="fa color_red size_24 fa-heart active" /></span>
                                            </a> */}

                                                            <Link
                                                                shallow={false}
                                                                key={Math.random()} href="/[dynamic]/[category]/[items]"
                                                                as={`${window.location.origin + router.asPath}/${categories.menuItemName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>
                                                                <a onClick={() => selectedItemClick(categories)} style={{ cursor: "pointer !important" }}>
                                                                    {categories.menuItemName}
                                                                </a>
                                                            </Link>

                                                            {(userinfo != undefined && userinfo != null) ?
                                                                <>
                                                                    {/* <a onClick={() => selectedItemClick(categories)}>
                                                                        {categories.menuItemName} </a>*/}
                                                                    <a>
                                                                        <span className="orange_btn remove-hover remove-bg fav" onClick={() => selectedFavoriteClick(categories, !categories.isFavoriteMenu)}>
                                                                            <i className={categories.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"} /></span>
                                                                    </a>
                                                                </>
                                                                :
                                                                <a data-toggle="modal" data-target="#myModal-logintest">
                                                                    <span onClick={logindetailsclick} className="orange_btn remove-hover remove-bg fav" >
                                                                        <i className={categories.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"} /></span>
                                                                </a>
                                                            }
                                                        </h3>

                                                        {/* <a className="orange_price_btn fixed-price-box" href="#">$12.99</a> */}
                                                        <NumberFormat className="orange_price_btn fixed-price-box"
                                                            value={categories.menuItemPrice != undefined ? categories.menuItemPrice : ""}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                            prefix={currency}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                        />
                                                        <p>{categories.description}</p>

                                                        <Link
                                                            shallow={false}
                                                            key={Math.random()} href="/[dynamic]/[category]/[items]"
                                                            as={`${window.location.origin + router.asPath}/${categories.menuItemName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>

                                                            <a onClick={() => selectedItemClick(categories)} style={{ cursor: "pointer !important" }}>
                                                            <span className="fa angle size_15 angle-round bg_green color_white fa-angle-right" />
                                                                {/* <a onClick={() => selectedItemClick(categories)}><span className="fa angle size_15 angle-round bg_green color_white fa-angle-right" /></a> */}
                                                                
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-lg-12 s-piza col-sm-12 col-xs-12">
                                    <div className="row">
                                        <div className="col-lg-4 flush-right text-center col-sm-4 col-xs-12">
                                            <a><img src="/images/work-in-progress.png" className="itemimage" alt="true" /></a>
                                        </div>
                                        <div className="col-lg-8 col-sm-8 col-xs-12">
                                            <a>
                                            </a><div className="itembox"><a>
                                            </a><div className="tablerow"><a>
                                            </a><div className="tablecell"><a>
                                            </a><h3 className="color_black margin_bottom_10">

                                                            <a onClick={() => selectedItemClick(categories)}> {categories.menuItemName} </a>
                                                            {(userinfo != undefined && userinfo != null) ?
                                                                <a onClick={() => selectedFavoriteClick(categories, !categories.isFavoriteMenu)}><span className="orange_btn remove-hover remove-bg fav" >
                                                                    <i className={categories.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"} /></span>
                                                                </a>
                                                                :
                                                                <a data-toggle="modal" data-target="#myModal-logintest" onClick={logindetailsclick}><span className="orange_btn remove-hover remove-bg fav" >
                                                                    <i className={categories.isFavoriteMenu === true ? "fa color_red size_24 fa-heart active" : "fa color_red size_24 fa-heart-o"} /></span>
                                                                </a>
                                                            }
                                                        </h3>
                                                        {/* <a className="orange_price_btn fixed-price-box" href="#">{categories.menuItemPrice}</a> */}

                                                        <NumberFormat className="orange_price_btn fixed-price-box"
                                                            value={categories.menuItemPrice != undefined ? categories.menuItemPrice : ""}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                            prefix={currency}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                        />

                                                        <CartQuantityArea menuitem={categories}  cartdetails={cartdetails}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}
                </div>
            )
        }
    }

    return (
        <>
            <div className="col-lg-6 pull-right pizza-in col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                        <h1>{selectedCategory.catName}</h1>
                    </div>
                </div>
                {slides}
                {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
            </div>
        </>
    )
}

export default MenuItemIntroComponentNew
