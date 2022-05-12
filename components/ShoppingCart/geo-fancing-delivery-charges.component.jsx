import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CartServices } from '../../redux/cart/cart.services';
import { GetCurrency } from '../helpers/utility';

const GeoFancingDeliveryCharges = () => {
    const [currency,setcurrency]=useState(GetCurrency())
    let deliverydata = useSelector(({ cart }) => cart.deliverycharges);

    if (deliverydata != undefined)
        return (
            <>
                {deliverydata?.DeliveryCharges != undefined &&
                    deliverydata.DeliveryCharges.length > 0 &&
                    <div className="col-lg-12 col-sm-12 col-xs-12 margin_top_30"  style={{height:350+'px',overflow:'auto'}}>
                        <div className="col-lg-12 bg_total col-sm-12 col-xs-12">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <h3 className="color_black size_22 transformNone margin_bottom_15">Delivery Charges</h3>
                            </div>
                            <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                <table className="table-responsive width_80">
                                    <tr>
                                        <th>Zone</th>
                                        <th>Min. Order</th>
                                        <th>Charge</th>
                                    </tr>
                                    {deliverydata != undefined &&
                                        deliverydata.DeliveryCharges != undefined &&
                                        deliverydata.DeliveryCharges.map((item,index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.zone}</td>
                                                    <td>{currency}{item.amount}</td>
                                                    <td>{currency}{item.charges}</td>
                                                </tr>
                                            )
                                        })}
                                </table>
                            </div>
                        </div>
                    </div>}
            </>
        )
}

export default GeoFancingDeliveryCharges;