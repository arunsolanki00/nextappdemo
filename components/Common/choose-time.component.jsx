import React, { useState, useEffect, useMountEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import Image from "next/image";
import { OrderServices } from '../../redux/order/order.services';
import { setordertime } from '../../redux/order/order.action';
import { numberValidate } from '../helpers/validate';
import { DeliveryMessage } from '../helpers/static-message/delivery-message';
const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
        fontSize: 3
    },
    timepickerFont: {
        color: '#9C9C9C !important',
        fontFamily: 'Circular Std Book !important',
        fontSize: '35px !important',
        fontWeight: '300 !important',
        letterSpacing: '0 !important',
        textTransform: 'uppercase !important',
        // paddingTop: '0px !important',
        paddingRight: '0px !important',
        // paddingBottom: '0px !important',
        paddingLeft: '8px !important',
        border: '0px none !important',
        width:'75px !important',
    },
}));

const Choosetime = (props) => {
    const dispatch = useDispatch();
    const restaurantinfo = props.restaurantinfo; //useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const restaurantWindowTime = props.restaurantWindowTime; //useSelector(({ main }) => main.restaurantWindowTime);
    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const pickupordelivery = useSelector(({ selecteddelivery }) => selecteddelivery.pickupordelivery);
    const ordertype = props?.ordertype;
    const selecetdtime = useSelector(({ order }) => order.checktime);
    const isasap = useSelector(({ order }) => order.isasap);
    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
     
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState();
    const [meridiem, setMeridiem] = useState();
    const [timeErrorMessage, setTimeErrorMessage] = useState("");
    const [successMessage, setsuccessMessage] = useState("");
    const [isdisable, setisdisable] = useState(false)

    const [isTimeLoad, setisTimeLoad] = useState(false)

    const pickuptime = [];
    const deliverytime = [];


    if ((hour === '' && !isTimeLoad)) {
        if(selecetdtime !== undefined && selecetdtime !== '')
        {
            let time = selecetdtime.split(' ');
            let newtime = time[0].split(':');
            setHour(newtime[0]);
            setMinute(newtime[1]);
            setMeridiem(time[1]);
            setisTimeLoad(true);
        }
        else{
            OrderServices.getOrderTiming(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((gettimeresponse) => {
                if (gettimeresponse) {
                    if (gettimeresponse?.result) {
                        
                        if (gettimeresponse.result?.time) {
                            let time = gettimeresponse.result.time.split(' ');
                            let newtime = time[0].split(':');
    
                            setHour(newtime[0]);
                            setMinute(newtime[1]);
                            setMeridiem(time[1]);
                            setisTimeLoad(true);
                        }
                    }
                }
            });
        }
    }    

    pickupWindow && pickupWindow.map((data) => {
        pickuptime.push(<> {data} <br /> </>);
    })
    deliveryWindow && deliveryWindow.map((data) => {
        deliverytime.push(<>{data} <br /> </>);
    })

    // Arun code
    const handleIncreaseHour = (e) => {
        setTimeErrorMessage("")
        setisdisable(false)
        if (e != undefined) {
            if (parseInt(hour) !== 12) {
                let h = parseInt(hour) + 1;
                setHour(h.toString().length === 1 ? `0${h}` : h);
            }
            else {
                let h = 1;
                setHour(h.toString().length === 1 ? `0${h}` : h);
                meridiem === 'AM' ? setMeridiem('PM') : setMeridiem('AM');
            }
        }
    }
    const handleDecreaseHour = (e) => {
        setTimeErrorMessage("")
        setisdisable(false)
        if (e != undefined) {
            if (parseInt(hour) !== 1) {
                let h = parseInt(hour) - 1;
                setHour(h.toString().length === 1 ? `0${h}` : h);
            }
            else {
                setHour(12);
                meridiem === 'AM' ? setMeridiem('PM') : setMeridiem('AM');
            }
        }
    }

    const handleIncreaseMinute = (e) => {
        setTimeErrorMessage("")
        setisdisable(false)
        if (e != undefined) {
            if (parseInt(minute) !== 59) {
                let m = parseInt(minute) + 1;
                setMinute(m.toString().length === 1 ? `0${m}` : m);
            }
            if (parseInt(minute) === 59) {
                setMinute('00');
                let h = parseInt(hour) + 1;
                setHour(h.toString().length === 1 ? `0${h}` : h);
            }
        }
    }

    const handleDecreaseMinute = (e) => {
        setTimeErrorMessage("")
        setisdisable(false)
        if (e != undefined) {
            if (parseInt(minute) !== 0) {
                let m = parseInt(minute) - 1;
                setMinute(m.toString().length === 1 ? `0${m}` : m);
            }
            if (parseInt(minute) === 0) {
                setMinute(59);
                let h = parseInt(hour) - 1;
                setHour(h.toString().length === 1 ? `0${h}` : h);
            }
        }
    }
    const handleMeridiem = (e) => {
        setTimeErrorMessage("")
        setisdisable(false)
        if (e != undefined) {
            meridiem === 'AM' ? setMeridiem('PM') : setMeridiem('AM');
        }
    }

    const handlesave = (e) => {
        e.preventDefault()
         
        // setfullTime(hour + ':' + minute + ' ' + meridiem);
        OrderServices.checkOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, parseInt(hour) + ':' + parseInt(minute), meridiem, ordertype)
            .then((response) => {
                console.log(response,"responese")
                if (response.result != undefined && response.result !== null) {

                    if (response.result.status !== 'success') {
                        setTimeErrorMessage(response.result.message);
                        setisdisable(true);
                        setsuccessMessage('');
                        dispatch(setordertime(''));
                    }

                    if (response.result.status === 'success') {
                        let timedisplay = hour + ':' + minute + ' ' + meridiem;
                        if (ordertype == 1) {
                            setsuccessMessage(response.result.message);
                        }
                        if (ordertype == 2) {
                            if (response.result?.message) {
                                setsuccessMessage(response.result.message);
                            }
                        }
                        setTimeout(function () { popupClose(timedisplay); }, 2000);
                    }
                }
            });
    }

    const popupClose = (selectedtime) => {
         
        setsuccessMessage('');
        setHour('');
        setisTimeLoad(false);
        let choosetimeclose = document.getElementById("choosetimeclose");
        if (choosetimeclose) {
            props.checktimeselected(selectedtime, "");
            choosetimeclose.click();
        }
        $('.modal-backdrop').remove();
    }

    const handleclose = (e) => {
        e.preventDefault();
        setsuccessMessage('');
        setHour('');
        setisTimeLoad(false);
        let choosetimeclose = document.getElementById("choosetimeclose");
        if (choosetimeclose) {
            props.checktimeselected("", timeErrorMessage);
            choosetimeclose.click();
        }
        $('.modal-backdrop').remove();
    }

    const onChangeMinute = (e) => {
        let mm = e.target.value;
        if (mm === "") {
            setMinute('');
            return;
        }

        if (!numberValidate(mm) || mm > 59) {
            return;
        }
        setMinute(mm);
        setisdisable(false)
    }

    const onChangeHour = (e) => {
        let hh = e.target.value;
        if (hh === "") {
            setHour('');
            return;
        }
        if (!numberValidate(hh) || hh > 12) {
            return;
        }

        setHour(hh);
        setisdisable(false)
    }

    const classes = useStyles();
    return (
 
        <div id="myModal-timer" className="modal choose-time fade" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body" id="pickup">
                        <div className="row">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <button type="button" className="close" onClick={handleclose} data-dismiss="modal" id="choosetimeclose"><img src="/images/close.svg" alt="" /></button>
                                <h3> {pickupordelivery !== '' ? 'Choose ' + pickupordelivery : 'Choose'} time</h3>
                            </div>
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">

                                <form className={classes.container}>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="col-md-3">
                                            </div>
                                            <div className="col-md-2" onClick={handleIncreaseHour}>
                                                <img src="/images/arrow-up.png" height={16} width={30}/>
                                            </div>
                                            <div className="col-md-2" onClick={handleIncreaseMinute}>
                                                <img src="/images/arrow-up.png" height={16} width={30}/>
                                            </div>
                                            <div className="col-md-2" onClick={handleMeridiem}>
                                                <img src="/images/arrow-up.png" height={16} width={30}/>
                                            </div>
                                            <div className="col-md-3">
                                            </div>
                                        </div>

                                        <div className="col-md-12"  style={{height:"48px"}}>
                                            <div className="col-md-3">
                                            </div>
                                            <div className="col-md-2">
                                                <input type="text" name="hour" onChange={(e) => onChangeHour(e)} value={hour} className={classes.timepickerFont} />
                                            </div>
                                            <div className="col-md-2">
                                                <input type="text" name="minute" onChange={(e) => onChangeMinute(e)} value={minute} className={classes.timepickerFont} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className={classes.timepickerFont}> {meridiem} </span>
                                            </div>
                                            <div className="col-md-3">
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="col-md-3">
                                            </div>
                                            <div className="col-md-2" onClick={handleDecreaseHour}>
                                                <img src="/images/arrow-down.svg" height={18} />
                                            </div>
                                            <div className="col-md-2" onClick={handleDecreaseMinute} >
                                                <img src="/images/arrow-down.svg" height={18} />
                                            </div>
                                            <div className="col-md-2" onClick={handleMeridiem} >
                                                <img src="/images/arrow-down.svg" height={18} />
                                            </div>
                                            <div className="col-md-3">
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="row in">
                            {props.isTakeAway === true && <div className="col-lg-6 col-sm-6 col-xs-12">
                                <h5 className="size_18 color_black weight_300 margin_bottom_20">
                                    <i className="fa fa-clock-o"></i>Pickup Window<br />
                                    <span className="size_20 color_grey">{pickuptime && pickuptime.length > 0 ? pickuptime : 'Closed Today!'}</span>
                                    <br /> <span> {DeliveryMessage.Last_Order} </span>
                                </h5>
                            </div>
                            }
                            {props.isDelivery === true && <div className="col-lg-6 col-sm-6 col-xs-12">
                                <h5 className="size_18 color_black weight_300 margin_bottom_20">
                                    <i className="fa fa-clock-o"></i>Delivery Window<br />
                                    <span className="size_20 color_grey">{deliverytime && deliverytime.length > 0 ? deliverytime : 'Closed Today!'}</span>
                                    <br /> <span> {DeliveryMessage.Last_Order} </span>
                                </h5>
                            </div>
                            }
                        </div>

                        {timeErrorMessage && timeErrorMessage !== "" && <h5 className="size_18 weight_300 margin_bottom_20 text-align-center" style={{ color: "red" }}> {timeErrorMessage} </h5>}
                        {successMessage && successMessage !== "" && <h5 className="size_18 weight_300 margin_bottom_20 text-align-center" style={{ color: "green" }}> {successMessage}  </h5>}

                        <div className="row">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                {
                                    isdisable ? <a className="blue_btn nextbtn customdisable">Save</a>
                                        : <a className="blue_btn nextbtn" onClick={handlesave}>Save</a>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Choosetime;