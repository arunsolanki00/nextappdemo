import React, { useState } from "react";
import { useSelector } from "react-redux";
import { GetCurrency } from "../../helpers/utility";
import { MenuItemRedeemPointData } from "./menu-item-redeem-point.data";


const MenuItemRedeemPoint = () => {
    let rewardpoints = useSelector(({ cart }) => cart.rewardpoints);
    const [amount, setamount] = useState(parseFloat(rewardpoints.rewardamount) > 0 ?
        parseFloat(rewardpoints.rewardamount).toFixed(2) : 0);
    const [point, setpoint] = useState(rewardpoints.rewardPoint);


    return (
        <div>
            <div className="col-lg-12 col-sm-12 col-xs-12">
                <span className="ora">You have <em>{point}</em> reward<br />
                    points, worth <em>${amount}.</em><br />
                    <em className="sm">You can redeem {point} points or
                        {GetCurrency}{amount}</em>
                    <a className="red" href="#">Redeem points</a>
                </span>
            </div>
        </div>
    )
}

export default MenuItemRedeemPoint;