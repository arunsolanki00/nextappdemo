import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { PopupMoreMessage } from "../helpers/static-message/popup-message";

const RestaurantTimmingComponent = (props) => {
  let restauranttiming = useSelector(({ restaurant }) => restaurant.restaurantstiminglist);
  const [data, dataSet] = useState(restauranttiming);
  const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
  const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
  const [opencloseTimmingObj, setopencloseTimmingObj] = useState([]);

  const deliveryExtraTime = restaurantinfo?.defaultLocation?.ordersubmittime;
  const takeawayExtraTime = restaurantinfo?.defaultLocation?.takeawayextratime;

  const isTakeOutAsap = defaultLocation.isTakeOutAsap;
  const isTakeOutPickupTime = defaultLocation.isTakeOutPickupTime;
  const isDeliveryAsap = defaultLocation.isDeliveryAsap;
  const isDeliveryPickupTime = defaultLocation.isDeliveryPickupTime;

  const [isTakeoutClosed, setIsTakeoutClosed] = useState((defaultLocation.istakeaway === false || (isTakeOutAsap === false && isTakeOutPickupTime === false)) ? true : false)
  const [isDeliveryClosed, setIsDeliveryClosed] = useState((defaultLocation.isdelivery === false || (isDeliveryAsap === false && isDeliveryPickupTime === false)) ? true : false)

  useEffect(() => {
    dataSet(restauranttiming)
  }, [restauranttiming, restauranttiming?.length])

  const days = [0, 1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    var opencloseTimming = [];
    let deliveryTime = data?.deliveryTime;

    if (deliveryTime) {
      if (deliveryTime.length > 0) {

        days.map((day) => {
          let deliverytimenew = data.deliveryTime.filter(
            (time) => time.nameday === day
          );
          let takeawaytime = data.takeoutTime.filter(
            (time) => time.nameday === day
          );

          if (deliverytimenew.length > 0) {
            opencloseTimming.push(
              <tr>
                {!isTakeoutClosed &&
                  <td>
                    <h5>
                      {deliverytimenew[0].weekname} <br />
                      <span>
                        {takeawaytime !== null &&
                          takeawaytime
                            .map((t, index) => (
                              t.isactive === false ?
                                <span className="color_red" key={index}> Closed </span>
                                :
                                <div key={Math.random()} id={index}>
                                  {t.openingtime +
                                    " " +
                                    t.openingtimemeridian +
                                    " - " +
                                    t.closingtime +
                                    " " +
                                    t.closingtimemeridian}
                                  <br />
                                </div>
                            ))
                        }
                      </span>
                      <br />
                    </h5>
                  </td>
                  
                }

                {!isDeliveryClosed &&

                  <td style={{ paddingTop: "0px !important" }}>
                    <h5>
                      {isTakeoutClosed &&
                        <>{deliverytimenew[0].weekname} <br /></>
                      }

                      <span className={(isTakeoutClosed ? "" : "padding_top_38")} >
                        {deliverytimenew !== null &&
                          deliverytimenew.map((d, index) => (
                            d.isactive === false ?
                              <span className="color_red" key={index}> Closed </span>
                              :
                              <div key={index} id={index}>
                                {d.openingtime +
                                  " " +
                                  d.openingtimemeridian +
                                  " - " +
                                  d.closingtime +
                                  " " +
                                  d.closingtimemeridian}
                                <br />
                              </div>
                          ))}
                      </span>
                      <br />
                    </h5>
                  </td>
                }
              </tr>
            );
          }
        })
      }
    }
    setopencloseTimmingObj(opencloseTimming);
  }, [props.id, restauranttiming, restauranttiming?.deliveryTime.length, restauranttiming?.takeoutTime.length, data, data.length]);

  return (
    opencloseTimmingObj &&
    <>
      <div id="myModal-2" className="modal fade" role="dialog">
        <div className="modal-dialog">
          {/* Modal content*/}
          <div className="modal-content">
            <div className="modal-body">
              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <button type="button" className="close" data-dismiss="modal" >
                  <img src="/images/close.svg" alt="close" />
                </button>
                <h4 style={{fontSize:"25px"}}>
                  <i className="fa fa-clock-o" /> {PopupMoreMessage.RESTAURENT_HOURS}
                </h4>
              </div>
              <div className="col-lg-12 col-sm-12 col-xs-12">
                {!isTakeoutClosed &&
                  <div className="col-lg-6 col-sm-6 col-xs-6">
                    <h5  style={{ fontSize: "22px", color: "#0D191B" }}> Pickup Window</h5>
                    <span className="color_grey"> Last order {takeawayExtraTime} min before close </span>
                  </div>
                }
                {!isDeliveryClosed  &&
                  <div className="col-lg-6 col-sm-6 col-xs-6">
                    <h5 style={{ fontSize: "22px", color: "#0D191B" }}>Delivery Window </h5>
                    <span className="color_grey"> Last order {deliveryExtraTime} min before close </span>
                  </div>
                }
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                    </thead>
                    <tbody>{opencloseTimmingObj}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantTimmingComponent;
