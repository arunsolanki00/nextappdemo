import React, { useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { GetCurrency } from '../helpers/utility';
const RewardPointDetail = () => {

  let rewardpoints = useSelector(({ cart }) => cart.rewardpoints);
  let rewardvalue = rewardpoints?.rewardvalue;
  const [point, setpoint] = useState(rewardpoints?.rewardPoint);
  const [amount, setamount] = useState(parseFloat(rewardpoints?.rewardamount) > 0 ? parseFloat(rewardpoints?.rewardamount).toFixed(2) : 0);
  const [currency, setcurrency] = useState(GetCurrency());

  return (
        <div className="col-lg-12 col-sm-12 col-xs-12">
        <div className="col-lg-12 orange_div ora col-sm-12 col-xs-12 removedLHeight">
          <div className="col-lg-12 col-sm-12 col-xs-12">
            <span className="color_white size_16 line_height_1_5">
            You have <em className="weight_500 size_24 style_normal">{point}</em>{" "}
              reward points, worth{" "}
              <em className="weight_500 size_24 style_normal">{currency}{amount}</em>
              <br />
              <em className="color_lightgrey size_12 weight_400 size_12 style_normal sm">
              You can redeem {" "} {point} {" "}points or {" "} {currency}{" "}{amount}
              </em>
            </span>
          </div>
          <div className="col-lg-12 col-sm-12 col-xs-12 ">&nbsp;</div>
        </div>
      </div>
    )
}

export default RewardPointDetail
