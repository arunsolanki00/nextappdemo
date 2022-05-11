import React, { useState, useEffect } from "react";
import Image from "next/image";
import { NotificationsServices } from "../../redux/notifications/notifications.services";
import { shallowEqual, useSelector } from "react-redux";
import Loader from "../Common/loader/loader.component";

const NotificationListComponent = (props) => {
  const [notificationList, setNotificationList] = useState([]);
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
  const customerId = userinfo ? userinfo.customerId : 0;

  useEffect(() => {

    NotificationsServices.getNotifications(props.restaurantId, customerId).then(
      (response) => {
        if (response) {
          setNotificationList(response.NotificatioList);
        }
      }
    );
  }, []);

  const notificationArrayList = [];
  if (notificationList && notificationList.length > 0) {
    for (let i = 0; i < notificationList.length; i += 2) {

      const evenItem = notificationList[i];
      const oddItem = notificationList[i + 1];

      notificationArrayList.push(
        <div className="col-lg-12 notification col-sm-12 col-xs-12" key={i}>
          <div className="row">
            {oddItem ? (

              <div className="col-lg-6 col-sm-6 col-xs-12">
                <div className={oddItem.isread === true ? "bd active" : "bd"} >
                  <h5>
                    {oddItem.NotificationTypeMessage}
                    <br />
                    <span>
                      {oddItem.message} {" "}
                    </span>
                    <span>
                      {oddItem.newcreatdate}
                    </span>
                  </h5>
                </div>
              </div>

            ) : (
              ""
            )}
            {evenItem ? (
              <div className="col-lg-6 col-sm-6 col-xs-12" >
                <div className={evenItem.isread === true ? "bd active" : "bd"}>
                  <h5>
                    {evenItem.NotificationTypeMessage}
                    <br />
                    <span>
                      {evenItem.message} {" "}
                    </span>
                    <span>
                      {evenItem.newcreatdate}
                    </span>
                  </h5>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    }
  }
  return (
    <div className="row">
      <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
        <div className="row">
          {notificationArrayList}
        </div>
      </div>
    </div>
  );

}

export default NotificationListComponent;
