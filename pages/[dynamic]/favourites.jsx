import React, { useState, useEffect } from "react";
import { FavouritesServices } from "../../redux/favourites/favourites.services";
import Image from "next/image";
import LeftMenuComponent from "../../components/LeftMenu/leftmenu.component";
import { MemoizedCartCounterComponent } from "../../components/Header/cart-counter.component";
import DeliveryDropdownComponent from "../../components/Header/delivery-dropdown.component";
import { MemoizedHeaderLogoComponent } from "../../components/Header/headerlogo.component";
import Head from "next/head";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import FavouritesComponent from "../../components/favourites/favourites.component";
import { FavouritesSkeleton } from "../../components/Common/Skeleton/favourites-skeleton.component";

const Favourites=()=> {
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
  const [favourites, setFavourites] = useState([]);
  const [loadingState, setloadingState] = useState(false)
  useEffect(() => {
    setloadingState(true);
    const timer = setTimeout(() => {
      FavouritesServices.getFavouritesList(restaurantinfo.restaurantId, userinfo.customerId, restaurantinfo.defaultlocationId).then((response) => {
        if (response) {
          setFavourites(response);
        }
        setloadingState(false);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
                <MemoizedHeaderLogoComponent restaurantinfo={restaurantinfo} />
                <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                  <DeliveryDropdownComponent />
                  <MemoizedCartCounterComponent />
                </div>
              </div>
              <div className="col-lg-12 h1-margin pull-right flush xsnoflush col-sm-12 col-xs-12">
                <h1>Favourites</h1>
              </div>
            </div>
            <>
              {!loadingState || favourites.length > 0 ? (
                <FavouritesComponent favouriteList={favourites} restaurantinfo={restaurantinfo} />
              ) :
                <FavouritesSkeleton/>
               }
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default Favourites;
