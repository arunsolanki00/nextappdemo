import React, { useEffect, useState } from 'react'
import { MemoizedCartCounterComponent } from '../../components/Header/cart-counter.component'
import DeliveryDropdownComponent from '../../components/Header/delivery-dropdown.component'
import { MemoizedHeaderLogoComponent } from '../../components/Header/headerlogo.component'
import PromotionComponent from '../../components/Main/Promotion/promotions'
import CategorySlideComponent from '../../components/Main/CategorySlider/category.slide.component';
import LeftMenuComponent from '../../components/LeftMenu/leftmenu.component';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { getAddress } from '../../redux/delivery-address/delivery-address.action'
import { GetCurrency } from '../../components/helpers/utility'
import { refreshCategoryList } from '../../redux/main/main.action'

const MainPage =({ restaurant }) => {
    const [currency, setcurrency] = useState(GetCurrency())
    const router = useRouter();
    const { query: { dynamic }, } = router;

    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const allCategory = useSelector(({ main }) => main.maincategoryList, shallowEqual); // 
    const promotionCategory = useSelector(({ main }) => main.promotioncategoryList, shallowEqual);

    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    let rewardpoints = useSelector(({ cart }) => cart.rewardpoints);

    let cssProperties = {};
    const dispatch = useDispatch();

    const [HungryData, setHungryData] = useState([]);
    const [PromotionsData, setPromotionsData] = useState(null);
    const [loadcontent, setLoadcontent] = useState(false);
    const [calculatedreward, setcalculatedreward] = useState(0);

    const [amount, setamount] = useState(0.00);
    const [point, setpoint] = useState(0);

    useEffect(() => {
        if(restaurantinfo && restaurantinfo !== undefined)
            dispatch(refreshCategoryList(restaurantinfo,customerId));
    }, [])

    useEffect(() => {
        if (dynamic && dynamic !== undefined) {
            // if (userinfo) {
            //     const r = userinfo.totalRewardPoints > 0 ? userinfo.totalRewardPoints : 0;
            //     const rv = userinfo.rewardvalue > 0 ? userinfo.rewardvalue : 0;
            //     if (r > 0 && rv > 0) {
            //         setcalculatedreward(r / rv);
            //     }
            // }
            promotionCategory.length > 0  ? setPromotionsData(promotionCategory) : setPromotionsData([]);
            allCategory.length > 0 ? setHungryData(allCategory) : setHungryData([]);
            
            setLoadcontent(true);
            dispatch(getAddress(customerId, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
        }
    }, [dynamic,promotionCategory.length,allCategory.length]);

    useEffect(() => {
        if (rewardpoints !== undefined && rewardpoints !== null && rewardpoints.length !== undefined) {
            setamount(parseFloat(rewardpoints.rewardamount));
            setpoint(rewardpoints.rewardPoint);
        } else if (userinfo != undefined && userinfo) {
            setamount(parseFloat(userinfo.totalRewardPoints / userinfo.rewardvalue));
            setpoint(userinfo.totalRewardPoints);
        }
    }, [userinfo]);

    if (loadcontent) {
        return (
            <>
                <Head>
                    <title>{restaurantinfo.restaurantname}: Online Ordering</title>
                    <meta name="description" content="Online description" />
                </Head>
                <div className="container-fluid">
                    <div className="row row-eq-height">
                        <LeftMenuComponent />
                        <div className="col-lg-9 pull-right right-content col-sm-9 col-xs-12">
                            <div className="row">
                                <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                                    {/* <HeaderLogoComponent /> */}
                                    <MemoizedHeaderLogoComponent restaurantinfo={restaurantinfo} />
                                    <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                                        <DeliveryDropdownComponent />
                                        <MemoizedCartCounterComponent />
                                    </div>
                                </div>
                                <div className="col-lg-12 h1-margin pull-right flush xsnoflush col-sm-12 col-xs-12">
                                    {userinfo ? (
                                        <h1 className="margin_top_0"><a data-toggle="modal" data-target="#myModal-get">Hi, {userinfo.firstname}!</a></h1>) : ('')}
                                    {userinfo ? (
                                        <span className="ora color_white size_17">You have
                                            <em className="color_white size_22">{" " + point + " "}</em> reward points, worth
                                            <a data-toggle="modal" data-target="#myModal-notification">
                                                <em className="color_white size_22">{" "} {currency}{amount.toFixed(2)}</em></a></span>) : ('')}
                                    <div className="rightAligned margin_top_15">
                                        {restaurantinfo.androidlink ?
                                            <a href={restaurantinfo.androidlink} target="blank">
                                                <img src="/images/android.png" style={{ maxHeight: "72px" }} />
                                            </a> : <>&nbsp;</>}<>&nbsp;</>
                                        {restaurantinfo.ioslink ?
                                            <a href={restaurantinfo.ioslink} target="blank">
                                                <img src="/images/app_store.png" style={{ maxHeight: "72px" }} />
                                            </a> : <>&nbsp;</>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                <hr />
                            </div>
                            <>
                                {PromotionsData != undefined && PromotionsData.length > 0 ?
                                    (
                                        <>
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <h3>Promotions</h3>
                                            </div>
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                {PromotionsData != undefined && PromotionsData.length > 0 && <PromotionComponent promotionslides={PromotionsData} />}
                                            </div>
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <hr />
                                            </div>
                                        </>
                                    ) : ('')}
                            </>
                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                <h3>Hungry?</h3>
                            </div>
                            <div className="col-lg-12 hung small-text-center col-sm-12 col-xs-12">
                                {HungryData.length > 0 && <CategorySlideComponent slides={HungryData} />}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else {
        return null;
    }
}

export default (MainPage)
