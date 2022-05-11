import { React, useEffect, useState } from "react";
import Image from "next/image";
import { CustomerServices } from "../../redux/customer/customer.services";
import Head from "next/head";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import useForm from "../Common/custom-hooks/useForm";
import validate from "./myaccount-update.validationRules";
import { LoginServices } from "../../redux/login/login.services";
import { LoginTypes } from "../../redux/login/login.types";
import { useRouter } from "next/router";
// import Compress from "compress.js";
import { resizeImageFn } from "../helpers/utility";
import { Custombutton } from "../Common/button/custombutton";

const defaultImgSrc = "../../public/images/pizza-1.png";
// import {Compress} from "compress";

const initialFieldValue = {
  imageName: '',
  imageSrc: defaultImgSrc,
  //imageFile:null
}

const MyAccountInfoComponentold = () => {
  const dispatch = useDispatch();
  let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

  const [count, setcount] = useState(0);
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
  const restaurantId = restaurantinfo.restaurantId;
  const locationId = restaurantinfo.defaultlocationId;
  const customerId = userinfo && userinfo.customerId ? userinfo.customerId : 0;

  const {  handleChange, handleSubmit,values, errors, isDisabled } = useForm(
    submitSuccess,
    validate
  );

  const [oldpassword, setoldpassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMesssage] = useState(null);
  const [showchangePassword, setShowchangePassword] = useState(false);
  const [fileData, setFile] = useState({ base64: '', fileList: null, type: '' });
  const [imageFileName, setimageFileName] = useState();
  
  if (userinfo && count <= 0) {
     
    if (userinfo && userinfo?.firstname) { values.firstname = userinfo.firstname; }
    if (userinfo && userinfo?.lastname) { values.lastname = userinfo.lastname; }
    if (userinfo && userinfo?.phone) { values.phone = userinfo.phone; }
    if (userinfo && userinfo?.emailId) { values.emailId = userinfo.emailId; }
    if (userinfo && userinfo?.picture) {

      setFile(prevState => ({
        ...prevState,
        base64: userinfo.picture
      }));
    }
    setcount(count + 1);
  }


  const handleChangePassword = () => {
    let ischeck = !showchangePassword;

    setShowchangePassword(ischeck);
    if (ischeck) {
      CustomerServices.getCustomerPassword(restaurantId, restaurantinfo.defaultlocationId, customerId).then((response) => {
        if (response) {
          setoldpassword(response);
          values.validatePassword = true;
        }
      });
    } else {
      values.validatePassword = false;
      values.newpassword="";
      values.confirmpassword="";
    }
  };

  function readFile(file) {
    var files = { base64: '', fileList: file, type: '' };
    var reader = new FileReader();
    reader.onload = readSuccess;

    function readSuccess(evt) {
      files.base64 = evt.target.result;
      files.type = files.fileList.type;
      setFile(files);
      return;
    }
    reader.readAsDataURL(file);
  }

  const onfileChange = (e) => {
    if (e.target.files != null && e.target.files.length > 0) {
      setimageFileName(e.target.files[0].name);

        resizeImageFn(e.target.files[0]).then(responsedata => {
        readFile(responsedata); 
     });
    }
  }

  const disableChange = () =>{
  }

  function submitSuccess() {

    const updateUserInfoObj = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.emailId,
      phone: values.phone.trim().replace(/\D+/g, ""),
      picture: fileData !== null ? fileData.base64 : "",
      imgname: fileData !== null && fileData.fileList !== null ? imageFileName : "",
      imgtype: fileData !== null ? fileData.type : "",
      pass: values.confirmpassword ? values.confirmpassword : "",
      restaurantId: restaurantId,
      locationId: locationId,
      customerId: customerId,
    };
    submitData(updateUserInfoObj);
  }

  const submitData = async (updateUserInfoObj) => {
    if (updateUserInfoObj != undefined) {
      setSubmitting(true);

      const responsedata = await CustomerServices.updateCustomerInfo(updateUserInfoObj);
       
      console.log(responsedata)
      if (responsedata && responsedata.Customer != undefined) {
        if (responsedata.Customer) {
          dispatch({
            type: LoginTypes.USER_DETAIL,
            payload: responsedata.Customer,
          });
        }

        console.log("update success");
        setSubmitting(false);
        return;
      } else {
        setErrorMesssage(responsedata.message);
        setSubmitting(false);
        return;
      }
    }
  };


  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
          <h3 className="margin_bottom_25">Info</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 flush text-center col-sm-3 col-xs-12">
          <div className="col-lg-12 text-center col-sm-12 col-xs-12">
            <div className="user">
              {/* <img src="/images/pizza-1.png" alt /> */}
              {/* <a className="pencil"> */}
              {/* <img src="/images/pencil-white.svg" alt="" /> */}
              <input
                type="file"
                accept="image/*"
                height="150"
                width="130"
                onChange={onfileChange}
                //style={{ opacity: 0 }}
                className="fileId"
              />

              {/* </a>
               <a className="pencil">
                <img src="/images/pencil-white.svg" alt="" />
              </a> */}

              {/* <img src={fileData ? fileData.base64 : '/images/pizza-1.png'} alt="" height="150" width="130" /> */}
              <img src={fileData ? fileData.base64 : defaultImgSrc} alt="" height="150" width="130" />
       
                {/* <input
                type="file"
                accept="image/*"
                id="myaccount-fileupload"
                className="form-control-file"
                onChange={onfileChange}
              /> */}

             

              {/* <img src={values.imageSrc} className="card-img-top" /> */}

            </div>
          </div>
        </div>

        <div className="col-lg-10 infs flush col-sm-9 col-xs-12">
          <div className="row">
            <div className="col-lg-6 col-sm-6 col-xs-12 flush-right">
              <input
                type="text"
                placeholder="First name"
                name="firstname"
                required
                onChange={handleChange}
                value={values.firstname}
              />
              <label className="formlabel">First name</label>
              {errors.firstname && (
                <span className="error">{errors.firstname}</span>
              )}
            </div>
            <div className="col-lg-6 col-sm-6 col-xs-12">
              <input
                type="text"
                placeholder="Last name"
                name="lastname"
                required
                onChange={handleChange}
                value={values.lastname}
              />
              <label className="formlabel">Last name</label>
              {errors.lastname && (
                <span className="error">{errors.lastname}</span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-sm-4 col-xs-12 flush-right">            
              <input                
                type="text"
                placeholder="Phone"
                name="phone"
                onChange={disableChange}
                value={values.phone}                
              />
              <label className="formlabel">Phone</label>
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="col-lg-8 col-sm-8 col-xs-12">
              <input
                className="pen"
                type="text"
                placeholder="Email"
                name="emailId"
                required
                onChange={handleChange}
                value={values.emailId}

              />
              <label className="formlabel">Email</label>
              {errors.emailId && <span className="error">{errors.emailId}</span>}
            </div>
          </div>
          <div className="row">
            {showchangePassword === true && (
              <div className="col-lg-6 col-sm-6 col-xs-12">
                <input
                  type="text"
                  placeholder="Password"
                  name="password"
                  onChange={disableChange}
                  value={oldpassword}
                />
                <label className="formlabel">Password</label>
                {/* {password && <span className="help">{password}</span>} */}
              </div>
            )}

            <div className="col-lg-6 col-sm-6 col-xs-12">
              <a className="forgot" onClick={handleChangePassword}>
                Change Password
              </a>
            </div>
          </div>
          {showchangePassword === true && (
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-xs-12 flush-right">
                <input
                  type="password"
                  placeholder="Password"
                  name="newpassword"
                  onChange={handleChange}
                  value={values.newpassword}
                />
                <label className="formlabel">New Password</label>
                {errors.newpassword && <span className="error">{errors.newpassword}</span>}
              </div>
             
              <div className="col-lg-6 col-sm-6 col-xs-12">
                <input
                  type="password"
                  placeholder="Password"
                  name="confirmpassword"
                  onChange={handleChange}
                  value={values.confirmpassword}
                />
                <label className="formlabel">Confirm Password</label>
                {/* {errors.confirmpassword && (
                  <span className="help" style={{ color: "red" }}>{errors.confirmpassword}</span>
                )} */}
              {errors.confirmpassword && <span className="error">{errors.confirmpassword}</span>}
              </div>
            </div>
          )}
          <div className="row">
            
            {/* { submitting === true &&
              <div className="col-lg-12 col-sm-12 text-center col-xs-12">
                  Loading......
              </div>
            } */}
            <div className="col-lg-12 col-sm-12 text-center col-xs-12">
              {/* <a
                className="blue_btn blue_btn_porder width_400"
                onClick={handleSubmit}
              >
                Save My Details
              </a> */}
             {
               submitting?<Custombutton buttonText="Processing..." buttonclass="blue_btn blue_btn_porder width_400" 
               isDisable={true} buttonMethod={handleSubmit} disabledClass="blue_btn blue_btn_porder width_400 disabled_class" />
               :<Custombutton buttonText="Save My Details" buttonclass="blue_btn blue_btn_porder width_400" 
               isDisable={isDisabled} buttonMethod={handleSubmit} disabledClass="blue_btn blue_btn_porder width_400 disabled_class" />
             }
            </div>
          </div>
        </div>
      </div>
</>
  );
};

export default MyAccountInfoComponentold;
