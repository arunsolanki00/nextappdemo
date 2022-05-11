import React, { useEffect, useState } from 'react'

const CartCheckout = ({ tipdata, cartdata }) => {
    return (
        <div className="col-lg-12 col-sm-12 col-xs-12">
            <form>
                <div className="col-lg-12 total  padding_top_25 col-sm-12 col-xs-12">
                    <div className="col-lg-12 col-sm-12 col-xs-12">
                        <p className="margin_0 margin_top_15">Tip your Driver</p>
                    </div>
                    <div className="col-lg-12 pers col-sm-12 col-xs-12">
                        {tipdata.map((data, index) => {
                            return (
                                <a key={Math.random()} className={data.value === true ? "orange_price_btn" : ""} onClick={() => addtipclick(data)}>{data.text + '%'}</a>
                            )
                        })}
                        <span>$ <input type="number" placeholder="amount" value={tipamount != undefined && tipamount != "" && parseFloat(tipamount)} onChange={(e) => onchangetipamount(e)} /></span>
                    </div>
                    <div className="col-lg-12 col-sm-12 col-xs-12">
                        <p className="margin_0 margin_top_15"><b className="color_black">Sub total:</b> <span>$ {cartdata.cartDetails != undefined && cartdata.cartDetails.subTotal != undefined && cartdata.cartDetails.subTotal.toFixed(2)}</span></p>
                        <p className="margin_0 margin_top_15">Reedem Pts: {cartdata.cartDetails != undefined && cartdata.cartDetails.reedemPoints != undefined && cartdata.cartDetails.reedemPoints.toFixed(2)} <span>- $ {cartdata.cartDetails != undefined && cartdata.cartDetails.reedemAmount != undefined && cartdata.cartDetails.reedemAmount.toFixed(2)}</span></p>
                        <p className="margin_0 margin_top_15">Discount: <span>- $ {cartdata.cartDetails != undefined && cartdata.cartDetails.discountAmount != undefined && cartdata.cartDetails.discountAmount.toFixed(2)}</span></p>
                        <p className="margin_0 margin_top_15">Delivery: <span>$ {cartdata.cartDetails != undefined && cartdata.cartDetails.deliveryAmount != undefined && cartdata.cartDetails.deliveryAmount.toFixed(2)}</span></p>
                        <p className="margin_0 margin_top_15"><b className="color_black">Total pre tax.:</b> <span>$ {cartdata.cartDetails != undefined && cartdata.cartDetails.subTotalWithDiscount != undefined && cartdata.cartDetails.subTotalWithDiscount.toFixed(2)}</span></p>
                        <p className="margin_0 margin_top_15">HST Tax: @{cartdata.cartDetails != undefined && cartdata.cartDetails.taxPercentage != undefined && cartdata.cartDetails.taxPercentage}% <span> $ {cartdata.cartDetails != undefined && cartdata.cartDetails.hstTotal != undefined && cartdata.cartDetails.hstTotal.toFixed(2)}</span></p>
                        {cartdata.cartDetails != undefined && cartdata.cartDetails.systemAccessFee != undefined && cartdata.cartDetails.systemAccessFee > 0 && <p className="margin_0 margin_top_15">System Access Fee:<span> $ {cartdata.cartDetails.systemAccessFee.toFixed(2)}</span></p>}
                        <p className="margin_0 margin_top_15">Tip: <span>$ {tipvalue != undefined && tipvalue.toFixed(2)}</span></p>
                    </div>
                    <div className="col-lg-12 col-sm-12 col-xs-12">
                        <hr />
                    </div>
                    <div className="col-lg-12 col-sm-12 col-xs-12">
                        <h3 className="margin_top_20 margin_bottom_20">TOTAL <span className="color_orange size_24 float_right weight_300">$ {grandtotal != undefined && grandtotal.toFixed(2)}</span></h3>
                    </div>
                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                        <a className="blue_btn" href="#">Checkout</a>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CartCheckout;