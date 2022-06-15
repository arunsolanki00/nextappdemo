import {  useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { leftMenuToggle } from "../../redux/restaurants/restaurants.action";
import LoginMainComponent from "../login/login.component";
import { logout } from "../../redux/login/login.action";
import handleNotify from "../helpers/toaster/toaster-notify";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import { emptycart } from "../../redux/cart/cart.action";
import { LeftMenuName } from "../helpers/static-message/leftmenu-message";
import { clearSessionId, createSessionId } from "../../redux/session/session.action";
import { v4 as uuidv4 } from 'uuid';
function LeftMenuComponent() {
  let isOpen = useSelector(({ restaurant }) => restaurant.leftmenutoggle);
  const dispatch = useDispatch();

  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );
  const router = useRouter();
  const { logo, restaurantURL } = restaurantinfo;
  const { query: { dynamic, location,id, category, index } } = router;
  const handleClick = () => {
    dispatch(leftMenuToggle(!isOpen));
  };

  const [showLogin, setShowLogin] = useState(false);

  const logindetailsclick = () => {
    if (userinfo === undefined || userinfo === null) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }

  const handlelogoutclick = () => {
    if (userinfo != undefined && userinfo != null) {
      dispatch(logout());
      dispatch(emptycart());
      dispatch(clearSessionId());
      // dispatch(cleardeliveryaddress());
      //CREATE SESSIONID AFTER THE LOGOUT
      let id=uuidv4()
      dispatch(createSessionId(id));
      handleNotify('logout successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
      router.push("/" + restaurantinfo.restaurantURL+"/"+location);
    }
    else {
      handleNotify('please login first, before logout!', ToasterPositions.TopRight, ToasterTypes.Info);
    }
  }

  return (
    <>
      <div
        className={`col-lg-1 left-menu col-sm-3 col-xs-12${isOpen ? " active-left" : ""}`}
      >
        <div className="col-lg-12 text-center logos col-sm-12 col-xs-12">
          <Link href="/[dynamic]/" as={`/${restaurantURL}/`}>
            <a>
              {logo ? (
                <img className="logo" src={logo} alt="" />
              ) : (
                ""
              )}
            </a>
          </Link>
          <a onClick={handleClick} className="bell">
            <span>
              <img src="/images/alarm-bell.svg" alt="" />

              {(userinfo !== undefined && userinfo !== null) &&
                <Link href="/[dynamic]/[location]/notifications" as={`/${restaurantURL}/${location}/notifications`}>
                  <span>
                    <em>2</em>
                  </span>
                </Link>}

              {(userinfo === undefined || userinfo === null) &&
                <a
                  onClick={() => logindetailsclick()}
                  data-toggle="modal"
                  data-target="#myModal-logintest">
                  <em>1</em>
                </a>}
            </span>
          </a>
        </div>
        <div className="col-lg-12 links flush col-sm-12 col-xs-12">
          <ul>
            <li id="homeid" className={router.pathname.includes('/main') ? "active" : ""} >
              <Link
                href="/[dynamic]"
                as={`/${restaurantURL}`} >
                <a> <em> <i className="fa fa-home"></i> <span>{LeftMenuName.HOME}</span> </em> </a>
              </Link>
            </li>
            <li id={"accountid"} className={router.pathname.includes("/myaccount") ? "active" : ""} >
              {(userinfo != undefined && userinfo != null) &&
                <Link href="/[dynamic]/[location]/myaccount" as={`/${restaurantURL}/${location}/myaccount`} >
                  <a><em> <i className="fa fa-user"></i> <span>{LeftMenuName.MYACCOUNT}</span> </em> </a>
                </Link>
              }
              {(userinfo === undefined || userinfo === null) &&
                <a
                  onClick={() => logindetailsclick()}
                  data-toggle="modal"
                  data-target="#myModal-logintest" >
                  <em><i className="fa fa-user"></i><span>{LeftMenuName.MYACCOUNT}</span> </em>
                </a>}
            </li>
            <li id={"orderid"} className={router.pathname.includes("/myorders") || router.pathname.includes("/orderdetail") ? "active" : ""}>
              {(userinfo != undefined && userinfo != null) &&
                <Link
                  href="/[dynamic]/[location]/myorders"
                  as={`/${restaurantURL}/${location}/myorders`} >
                  <a> <em> <i className="fa fa-cutlery"></i> <span>{LeftMenuName.MYORDERS}</span> </em> </a>
                </Link>}

              {(userinfo === undefined || userinfo === null) &&
                <a onClick={() => logindetailsclick()}
                  data-toggle="modal"
                  data-target="#myModal-logintest"
                >
                  <em> <i className="fa fa-cutlery"></i> <span>{LeftMenuName.MYORDERS}</span> </em>
                </a>
              }
            </li>
            <li id="favouriteid" className={router.pathname.includes("/favourites") ? "active" : ""}>
              {(userinfo != undefined && userinfo != null) &&
                <Link
                  href="/[dynamic]/[location]/favourites"
                  as={`/${restaurantURL}/${location}/favourites`} >
                  <a> <em> <i className="fa fa-heart-o"></i> <span>{LeftMenuName.FAVOURITES}</span> </em> </a>
                </Link>
              }
              {(userinfo === undefined || userinfo === null) &&
                <a
                  onClick={() => logindetailsclick()}
                  data-toggle="modal"
                  data-target="#myModal-logintest">
                  <em> <i className="fa fa-heart-o"></i> <span>{LeftMenuName.FAVOURITES}</span> </em>
                </a>
              }
            </li>

            <li className={router.pathname.includes("/testimonial") ? "active" : ""}>
              <Link
                href="/[dynamic]/[location]/testimonial"
                as={`/${restaurantURL}/${location}/testimonial`}>
                <a> <em> <i className="fa fa-quote-left"></i> <span>{LeftMenuName.TESTIMONIALS}</span> </em> </a>
              </Link>
            </li>
            <li className={router.pathname.includes("/locations") ? "active" : ""}>
              <Link
                href="/[dynamic]/[location]/locations"
                as={`/${restaurantURL}/${location}/locations`}>
                <a> <em> <i className="fa fa-spoon"></i> <span>{LeftMenuName.LOCATIONS}</span> </em> </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-lg-12 soc col-sm-12 col-xs-12">
          <a href="#">
            <i className="fa fa-facebook"></i>{" "}
          </a>
          <a href="#">
            <i className="fa fa-instagram"></i>{" "}
          </a>
        </div>
        <div className="col-lg-12 log col-sm-12 col-xs-12">
          {(userinfo !== undefined && userinfo !== null) &&
            <div className="col-lg-12 flush  text-center col-sm-12 col-xs-12">
              <a className="sign" onClick={handlelogoutclick}>
                <i className="fa fa-sign-out"></i> <span>{LeftMenuName.LOGOUT}</span>
              </a>
            </div>}
          <div className="col-lg-12 terms small-text-center text-right flush col-sm-12 col-xs-12">
            <a href="#">Terms & condition</a>
            <span>|</span>
            <a href="#">Privacy policy</a>
          </div>
        </div>
      </div>

      {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
    </>
  );
}

export default LeftMenuComponent;
