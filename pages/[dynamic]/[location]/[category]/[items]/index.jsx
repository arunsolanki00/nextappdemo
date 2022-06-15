import React, {  useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import BackHeaderComponent from '../../../../../components/Header/backheader.component'
import { MemoizedCartCounterComponent } from '../../../../../components/Header/cart-counter.component'
import DeliveryDropdownComponent from '../../../../../components/Header/delivery-dropdown.component';
import { useRouter } from "next/router";
import { MemoizedMenuItemHeaderLogoComponent } from '../../../../../components/Header/menuitemheaderlogo.component'
import { GetCurrency } from '../../../../../components/helpers/utility'
import LeftMenuComponent from '../../../../../components/LeftMenu/leftmenu.component'
import LoginMainComponent from '../../../../../components/login/login.component'
import MenuItemAddToCartComponent from '../../../../../components/menu-item-details/menu-item-add-to-cart/menu-item-add-to-cart.component'
import NewMenuItemDescription from '../../../../../components/new-menu-item-details/new-menu-item-description/new-menu-item-description.component'
import NewMenuItemOptionsParameter from '../../../../../components/new-menu-item-details/new-menu-item-options-parameter/new-menu-item-options-parameter.component'
import { addFavorite, deleteFavorite, getMenuItemDetailes,  removeMenuItemForFavorite, selectedMenuItem } from '../../../../../redux/menu-item/menu-item.action'
import {  selectedCategory } from '../../../../../redux/category/category.action';
import { CategoryServices } from '../../../../../redux/category/category.services';
import { CategoryTypes } from '../../../../../redux/category/category.types';

const Index = () => {
     
    const dispatch = useDispatch();
    const [amount, setamount] = useState(0.00);
    const [point, setpoint] = useState(0);
    let rewardpoints = useSelector(({ cart }) => cart?.rewardpoints);
    const userinfo = useSelector(({ userdetail }) => userdetail?.loggedinuser, shallowEqual);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant?.restaurantdetail, shallowEqual);
    const [currency, setcurrency] = useState(GetCurrency());
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();
    const { asPath } = router;
    const {
        query: { dynamic ,location},
    } = router;
    console.log(asPath)
    const [lstcarttopping, setlstcarttopping] = useState([]);
    let selcetedCategoryList;
    let menuItemDetail = useSelector(({ menuitem }) => menuitem?.menuitemdetaillist);
    let categoryitemlist = useSelector(({ category }) => category?.categoryitemlist);
    let maincategoryList = useSelector(({ main }) => main?.maincategoryList);
    let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.length > 0 && menuItemDetail.size.find(x => x.sizeselected === true);
    let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.length > 0 && menuItemDetail.topping.find(x => x.subparameterId == selectedsize.subparameterId);
    let selectedmenuitemdetail = useSelector(({ menuitem }) => menuitem?.selectedmenuitemdetail);
    const [count, setcount] = useState(Math.random());
    const [load, setload] = useState(0);

    useEffect(() => {
        //CONDITION FOR THE categoryitemlist REDUX IS EMPTY AND USER DIRECT ENTER THE LINK IN THE BROWSER 
        if (categoryitemlist.length === 0 || selectedmenuitemdetail.length === undefined) {
             
            const urlArray = asPath.split("/")
            const catagerySelected = maincategoryList.filter(x => x.catName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-") === urlArray[3].toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-"))
            dispatch(selectedCategory(catagerySelected[0]))
            CategoryServices.getCategoryItemList(restaurantinfo.restaurantId, catagerySelected[0].catId, userinfo ? userinfo.customerId : 1, restaurantinfo.defaultlocationId).then(response => {
                if (response) {
                    selcetedCategoryList = response;
                    dispatch({
                        type: CategoryTypes.CATEGORY_ITEM_LIST,
                        payload: response
                    })
                    let selectedCategoryItem;
                    if (selcetedCategoryList !== undefined && selcetedCategoryList !== null) {
                        selectedCategoryItem = selcetedCategoryList?.filter(x => x.menuItemName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-") === urlArray[4].toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-"))
                        dispatch(selectedMenuItem(selectedCategoryItem[0]));
                        dispatch(getMenuItemDetailes(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, 0, selectedCategoryItem[0].menuitemId, 0, 0));
                        setload(load + 1);
                    }
                }
            })
        } else {
            setload(load + 1)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (rewardpoints !== undefined && rewardpoints !== null) {
                setamount(parseFloat(rewardpoints.rewardamount));
                setpoint(rewardpoints.rewardPoint);
            } else if (userinfo != undefined && userinfo) {
                setamount(parseFloat(userinfo.totalRewardPoints / userinfo.rewardvalue));
                setpoint(userinfo.totalRewardPoints);
            }
        }, 500);
    }, [userinfo]);

    useEffect(() => {
        if (selectedtopping && selectedtopping?.list) {
            let lstcarttoppingNew = lstcarttopping;
            selectedtopping.list != undefined && selectedtopping.list.length > 0 &&
                selectedtopping.list.map((lsttop) => {
                    lsttop.type != undefined && lsttop.type.length > 0 &&
                        lsttop.type.map((type) => {
                            if (type.subOptionselected === true) {
                                lstcarttoppingNew.push(type)
                                setlstcarttopping(lstcarttoppingNew);
                            }
                        })
                })
        }
    }, [count]);
    const sendDataToParent = (index) => {
        if (index === true && (userinfo === undefined || userinfo === null)) {
            setShowLogin(true);
        }
        else {
            setShowLogin(false);
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

    const LoadingComponent = () => {
        return (
            <div>Loading...</div>
        )
    }
    const selectedFavoriteClick = (item) => {
        setcount(count + 1)
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
    const updateCount = () => {
        setcount(count + 1);
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row row-eq-height">
                    <LeftMenuComponent />
                    <div className="col-lg-9 pull-right p-2 right-content col-sm-9 col-xs-12">
                        <div className="row">
                            <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                                <BackHeaderComponent />
                                <MemoizedMenuItemHeaderLogoComponent />
                                <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                                    <DeliveryDropdownComponent />
                                    <MemoizedCartCounterComponent />
                                </div>
                            </div>
                        </div>
                        {(load > 0) &&
                            (
                                <div className='prod-details'>
                                    <div className="row">
                                        <div className="col-lg-8 h1-margin col-sm-8 col-xs-12 small-text-center">
                                            <h1>{menuItemDetail?.itemName}</h1>
                                        </div>
                                        {(userinfo != undefined && userinfo != null) &&
                                            <div className="col-lg-1 padding_right_50 margin_top_40 text-right col-sm-1 col-xs-12">
                                                <a className={"red-heart d-inline-block color_red size_28"} onClick={() => selectedFavoriteClick(!selectedmenuitemdetail.isFavoriteMenu)}>
                                                    <i className={selectedmenuitemdetail.isFavoriteMenu === true ? "fa color_red fa-heart active" : "fa color_red fa-heart-o"}></i>
                                                </a>
                                            </div>}
                                        {(userinfo === undefined || userinfo === null) &&
                                            <div className="col-lg-1 padding_right_50 margin_top_40 text-right col-sm-1 col-xs-12">
                                                <a className={"red-heart d-inline-block color_red size_28"}
                                                    onClick={() => logindetailsclick()}
                                                    data-toggle="modal"
                                                    data-target="#myModal-logintest"
                                                >
                                                    <i className={selectedmenuitemdetail.isFavoriteMenu === true ? "fa color_red fa-heart active" : "fa color_red fa-heart-o"}></i>
                                                </a>
                                            </div>}
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-9 col-sm-12 col-xs-12">
                                                    <div className="row">
                                                        <NewMenuItemDescription updateCount={updateCount} />
                                                    </div>
                                                    <div className="row new-tabs">
                                                        <NewMenuItemOptionsParameter count={count} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 rt-s flush col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 orange_div ora col-sm-12 col-xs-12 text-center removedLHeight">
                                                        <div className="col-lg-12 col-sm-12 col-xs-12 text-center">
                                                            <div className="color_white size_15">You have <em>{point}</em> reward points, <br />worth <em className="color_white size_24">{currency} {amount.toFixed(2)}</em><br /><em className="sm  color_white width_100">You can redeem {point} points or {amount}</em></div>
                                                        </div>
                                                    </div>
                                                    <MenuItemAddToCartComponent
                                                        ctopping={lstcarttopping}
                                                        sendDataToParent={sendDataToParent} />
                                                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
        </div>
    )
}

export default Index