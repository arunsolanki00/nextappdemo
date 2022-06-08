import React, { useState, useEffect } from "react";
import { GetCurrency } from "../helpers/utility";
import Image from "next/image";
import { useRouter } from "next/router";
import { Router } from "next/router";
import {
  addFavorite,
  deleteFavorite,
  getMenuItemDetailes,
  selectedMenuItem,
} from "../../redux/menu-item/menu-item.action";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getCategoryItemList,
  removeCategoryList,
  setCategoryList,
} from "../../redux/category/category.action";
import Link from "next/link";
import { FavouritesServices } from "../../redux/favourites/favourites.services";

const FavouritesComponent = (props) => {
  const [currency, setcurrency] = useState(GetCurrency());
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    query: { dynamic, id, category, index },
  } = router;
  const [favourites, setFavourites] = useState(props.favouriteList);
  var restaurantinfo = props.restaurantinfo;
  const userinfo = useSelector(
    ({ userdetail }) => userdetail.loggedinuser,
    shallowEqual
  );

  const favouriteList = [];
  for (let i = 0; i < favourites.length; i += 2) {
    const evenMenuItem = favourites[i];
    const oddMenuItem = favourites[i + 1];

    favouriteList.push(
      <div className="row row-eq-height">
        {oddMenuItem ? (
          <div className="col-lg-6 s-piza b-right b-bottom col-sm-12 col-xs-12">
            <div className="row row-eq-height">
              <div className="col-lg-4 flush-right xsnoflush text-center col-sm-4 col-xs-12">
                <img src="/images/pizza-1.png" alt="" className="itemimage" />
              </div>
              <div className="col-lg-8 col-sm-8 col-xs-12">
                <Link
                  shallow={false}
                  key={Math.random()}
                  href="/[dynamic]/[category]/[items]"
                  as={`${
                    window.location.origin
                  }/${dynamic}/${oddMenuItem.categoryName
                    .toLowerCase()
                    .toString()
                    .replace(/ /g, "-")}/${oddMenuItem.menuItemName
                    .toLowerCase()
                    .toString()
                    .replace(/ /g, "-")}`}
                >
                  <a onClick={() => selectedItemClick(oddMenuItem)}>
                    <div className="itembox">
                      <div className="tablerow">
                        <div className="tablecell">
                          <h3 className="color_black margin_bottom_10">
                            {oddMenuItem.menuItemName}
                          </h3>
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
                <a
                  className="orange_btn remove-hover remove-bg"
                  onClick={() => selectedFavoriteClick(oddMenuItem)}
                >
                  <i className="fa color_red size_24 fa-heart active" /> Added
                  to favourites
                </a>
                <span className="cls">~ 240 Cals</span>
                <a className="orange_price_btn">
                  {currency}
                  {oddMenuItem.price}
                </a>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {evenMenuItem ? (
          <div className="col-lg-6 s-piza b-bottom col-sm-12 col-xs-12">
            <div className="row row-eq-height">
              <div className="col-lg-4 flush-right xsnoflush text-center col-sm-4 col-xs-12">
                <img src="/images/pizza-2.png" alt="" className="itemimage" />
              </div>
              <div className="col-lg-8 col-sm-8 col-xs-12">
                <Link
                  shallow={false}
                  key={Math.random()}
                  href="/[dynamic]/[category]/[items]"
                  as={`${
                    window.location.origin
                  }/${dynamic}/${evenMenuItem.categoryName
                    .toLowerCase()
                    .toString()
                    .replace(/ /g, "-")}/${evenMenuItem.menuItemName
                    .toLowerCase()
                    .toString()
                    .replace(/ /g, "-")}`}
                >
                  <a onClick={() => selectedItemClick(evenMenuItem)}>
                    <div className="itembox">
                      <div className="tablerow">
                        <div className="tablecell">
                          <h3 className="color_black margin_bottom_10">
                            {evenMenuItem.menuItemName}
                          </h3>
                          <p>{evenMenuItem.description}</p>
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
                <a
                  className="orange_btn remove-hover remove-bg"
                  onClick={() => selectedFavoriteClick(evenMenuItem)}
                >
                  <i className="fa color_red size_24 fa-heart active" />
                  Added to favourites
                </a>
                <span className="cls">~ 240 Cals</span>
                <a className="orange_price_btn" href="#">
                  {currency}
                  {evenMenuItem.price}
                </a>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  const selectedItemClick = (item) => {
    if (item != undefined) {
      item.isFavoriteMenu = true; // need to set true as we need that at Menuitem componenet
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

  const selectedFavoriteClick = (selecteditem) => {
    favourites.map((data) => {
      if (data.menuitemid === selecteditem.menuitemid) data = selecteditem;
      else data = data;
    });

    //dispatch(deleteFavorite( userinfo.customerId, restaurantinfo.restaurantId, selecteditem.menuitemid));

    FavouritesServices.deletefavorite(
      userinfo.customerId,
      restaurantinfo.restaurantId,
      selecteditem.menuitemid
    ).then((dresponse) => {
      FavouritesServices.getFavouritesList(
        restaurantinfo.restaurantId,
        userinfo.customerId,
        restaurantinfo.defaultlocationId
      ).then((response) => {
        if (response) {
          setFavourites(response);
        }
      });
    });
    
  };
  return favourites != undefined && favourites && favourites.length > 0 ? (
    <>
      <div className="row" id="main">
        <div className="col-lg-12 pull-right favo pizza-in col-sm-12 col-xs-12">
          {favouriteList}
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default FavouritesComponent;
