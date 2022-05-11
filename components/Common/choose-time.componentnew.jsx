import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import handleNotify from '../helpers/toaster/toaster-notify';
import { ToasterPositions } from '../helpers/toaster/toaster-positions';
import { ToasterTypes } from '../helpers/toaster/toaster-types';
import { useState } from 'react';
import { savechoosetime } from '../../redux/selected-delivery-data/selecteddelivery.action';
// import {DateTimeField} from "react-bootstrap-datetimepicker";
import { Modal, Button, Form, FormGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

const ChoosetimeNew = () => {
    const dispatch = useDispatch();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
   
    const restaurantWindowTime = useSelector(({ main }) => main.restaurantWindowTime);
    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const pickupordelivery = useSelector(({ selecteddelivery }) => selecteddelivery.pickupordelivery);    

    const [selectedtime, setselectedtime] = useState();
    const [data, setData] = useState('');

    const [hour, setHour] = useState(6);
    const [minute, setMinute] = useState(30);
    const [meridiem, setMeridiem] = useState('AM');

    const pickuptime = [];
    const deliverytime = [];

    pickupWindow && pickupWindow.map((data) => {
        pickuptime.push(<> {data} <br /> </>);
    })
    deliveryWindow && deliveryWindow.map((data) => {
        deliverytime.push(<>{data} <br /> </>);
    })

    const handlechangetime = (e) => {
        if (e != undefined) {
            setselectedtime(e.target.value);
        }
    }
  const handleIncreaseHour = (e) => {
        if (e != undefined) {
            if(hour!==12){
                setHour(hour+1);
            }
            else{
                setHour(1);
                meridiem ==='AM'? setMeridiem('PM') : setMeridiem('AM');
            }
        }
    }
    const handleDecreaseHour = (e) => {
        if (e != undefined) {
            if(hour!==1){
                setHour(hour-1);
            }
            else{
                setHour(1);
                meridiem==='AM'? setMeridiem('PM') : setMeridiem('AM');
            }
        }
    }

    const handleIncreaseMinute = (e) => {
        if (e != undefined) {
            setMinute(minute + 1);
        }
    }
    const handleDecreaseMinute = (e) => {
        if (e != undefined) {
            setMinute(minute - 1);
        }
    }
    const handleMeridiem = (e) => {
        if (e != undefined) {
            meridiem ==='AM'? setMeridiem('PM') : setMeridiem('AM');
        }
    }

    const handlesave = () => {
        dispatch(savechoosetime(selectedtime));
        handleNotify('Delivery time is save succeessfully!', ToasterPositions.BottomRight, ToasterTypes.Success);
    }
  

    return (
        <div id="myModal-timer" className="modal choose-time fade" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body" id="pickup">
                        <div className="row">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <button type="button" className="close" data-dismiss="modal"><img src="/images/close.svg" alt="" /></button>
                                <h3>{pickupordelivery !== ''? 'Choose '+ pickupordelivery : 'Choose' } time</h3>
                            </div>
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <form>
                                    <table>
                                    <tr>
                                        <img src="/images/arrow-up.png" onClick={handleIncreaseHour} style={{ marginLeft: 150}} />
                                        <img src="/images/arrow-up.png" onClick={handleIncreaseMinute} style={{marginLeft: 10}} />
                                        <img src="/images/arrow-up.png" onClick={handleMeridiem} style={{marginLeft: 10}} />
                                    </tr>
                                    <tr>

                                        <span style={{marginLeft: 200,fontSize:30}}> {hour} </span>
                                        <span style={{marginLeft: 10,fontSize:30}}> {minute} </span>
                                        <span style={{marginLeft: 10,fontSize:30}}> {meridiem} </span>
                                    </tr>
                                    <tr>
                                        <img src="/images/arrow-down.svg" onClick={handleDecreaseHour} style={{marginLeft: 150}} />
                                        <img src="/images/arrow-down.svg" onClick={handleDecreaseMinute} style={{marginLeft: 10}}/>
                                        <img src="/images/arrow-down.svg" onClick={handleMeridiem} style={{marginLeft: 10}} />
                                    </tr>
                                    </table>
                                </form>
                            </div>
                        </div>
                        <div className="row in">
                            <div className="col-lg-6 col-sm-6 col-xs-12">
                                <h5 className="size_18 color_black weight_300 margin_bottom_20">
                                    <i className="fa fa-clock-o"></i>Pickup Window<br />
                                    <span className="size_20 color_grey">
                                    </span>
                                </h5>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12">
                                <h5 className="size_18 color_black weight_300 margin_bottom_20">
                                    <i className="fa fa-clock-o"></i>Delivery Window<br />
                                    <span class="size_20 color_grey">
                                    </span>
                                </h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <a className="blue_btn nextbtn" data-dismiss="modal" onClick={handlesave} >Save</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChoosetimeNew;