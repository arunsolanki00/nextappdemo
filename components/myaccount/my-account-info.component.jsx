import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";
import { CustomerServices } from "../../redux/customer/customer.services";
import Head from "next/head";
import {  useSelector, useDispatch } from "react-redux";
import useForm from "../Common/custom-hooks/useForm";
import validate from "./myaccount-update.validationRules";
import { LoginTypes } from "../../redux/login/login.types";
// import Compress from "compress.js";
import { Custombutton } from "../Common/button/custombutton";
import MyAddressesComponent from "./my-addresses.component";
const defaultImgSrc = "../../public/images/user.png";
// import {Compress} from "compress";

const initialFieldValue = {
  imageName: "",
  imageSrc: defaultImgSrc,
  //imageFile:null
};

const MyAccountInfoComponent = () => {
  const { handleChange, handleSubmit, values, errors, isDisabled } = useForm(
    submitSuccess,
    validate
  );
  
  const dispatch = useDispatch();
  let restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail
  );

  const [count, setcount] = useState(0);
  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
  const restaurantId = restaurantinfo.restaurantId;
  const locationId = restaurantinfo.defaultlocationId;
  const customerId = userinfo && userinfo.customerId ? userinfo.customerId : 0;
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({   x: 27,
    y: 15,unit: "%", height:50,width:50  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [fileData, setFile] = useState({
    base64: "",
    fileList: null,
    type: "",
  });
  const [oldpassword, setoldpassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMesssage] = useState(null);
  const [showchangePassword, setShowchangePassword] = useState(false);
  const [imageFileName, setimageFileName] = useState("");
  const [imageUpload, setimageUpload] = useState(false);
  const [imgType, setimgType] = useState("");
  const [displayImage, setdisplayImage] = useState(true);
  const [chageimage, setchageimage] = useState(false);
  const [imageshow, setimageshow] = useState(false);
  const [isdiplaycanvas, setisdiplaycanvas] = useState(true)
  const [IsChangetext, setIsChangetext] = useState()
  const onSelectFile = (e) => {
     
    setchageimage(true);
    setdisplayImage(false);
    setimageshow(false);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setimageFileName(e.target.files[0].name);
      setimgType(e.target.files[0].type);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;
    ctx.setTransform(pixelRatio,0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "low";
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  if (userinfo && count <= 0) {
    if (userinfo && userinfo?.firstname) {
      values.firstname = userinfo.firstname;
    }
    if (userinfo && userinfo?.lastname) {
      values.lastname = userinfo.lastname;
    }
    if (userinfo && userinfo?.phone) {
      values.phone = userinfo.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    if (userinfo && userinfo?.emailId) {
      values.emailId = userinfo.emailId;
    }
    if (userinfo && userinfo?.picture) {
      setFile((prevState) => ({
        ...prevState,
        base64: userinfo.picture,
      }));
    }
    if(userinfo && !userinfo?.picture){
      setIsChangetext(true)
    }
    setcount(count + 1);
  }

  const handleChangePassword = () => {
    let ischeck = !showchangePassword;
    setShowchangePassword(ischeck);
    if (ischeck) {
      CustomerServices.getCustomerPassword(
        restaurantId,
        restaurantinfo.defaultlocationId,
        customerId
      ).then((response) => {
        if (response) {
          setoldpassword(response);
          values.validatePassword = true;
        }
      });
    } else {
      values.validatePassword = false;
      values.newpassword = "";
      values.confirmpassword = "";
    }
  };

  const handleImageUpload = (e) => {
    setimageshow(true);
    setdisplayImage(false);
    setimageUpload(!imageUpload);
  };

  const disableChange = () => {};
  function submitSuccess() {
    //var croppedImg=null;
    let imgfilename="";
    let imgfiletype="";
    var croppedImg = completedCrop !== null ? getCroppedImg(imgRef.current, crop, imageFileName) : null;
    imgfilename = imageFileName;
    imgfiletype = imgType;
    // if(imgRef.current !== null)
    // {
    //   croppedImg = getCroppedImg(imgRef.current, crop, imageFileName);
    //   imgfilename = imageFileName;
    //   imgfiletype = imgType;
    //   //croppedImg=fileData.base64;
    // }
    // else if(fileData.base64 !== "")
    // {
    //   croppedImg =fileData.base64;
    //   imgfilename = imageFileName === "" && userinfo.imgname;
    //   imgfiletype = imgType === "" && userinfo.imgtype;
    // } else {
    //   croppedImg = null;
    // }

    const updateUserInfoObj = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.emailId,
      phone: values.phone.trim().replace(/\D+/g, ""),
      picture: croppedImg === null ? fileData.base64 : croppedImg, 
      imgname: imgfilename,
      imgtype: imgfiletype,
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
      const responsedata = await CustomerServices.updateCustomerInfo(
        updateUserInfoObj
      );
      if (responsedata && responsedata.Customer != undefined) {
        if (responsedata.Customer) {
          const customerdetails = {
            customerId: updateUserInfoObj.customerId,
            emailId: updateUserInfoObj.email,
            firstname: updateUserInfoObj.firstname,
            imgname: updateUserInfoObj.imgname,
            imgtype: updateUserInfoObj.imgtype,
            isVerified: userinfo.isVerified,
            lastname: updateUserInfoObj.lastname,
            loyaltynumber: userinfo.loyaltynumber,
            mobile: userinfo.mobile,
            phone: updateUserInfoObj.phone,
            picture: updateUserInfoObj.picture,
            restaurantId: restaurantId,
            rewardvalue: userinfo.rewardvalue,
            totalRewardPoints:userinfo.totalRewardPoints,
          };
          dispatch({
            type: LoginTypes.USER_DETAIL,
            payload: customerdetails,
          });
        }
        setSubmitting(false);
        setisdiplaycanvas(false)
        setdisplayImage(true)
        return;
      } else {
        setErrorMesssage(responsedata.message);
        setSubmitting(false);
        return;
      }
    }
  };
  //   get cropped image
  function getCroppedImg(image, crop, fileName) {
     
    // let naturalWidth=0;
    // naturalWidth = image?.naturalWidth;
    // let naturalHeight=0;
    // naturalHeight = image?.naturalHeight;
    const canvas = document.createElement("canvas");
    // const scaleX = naturalWidth > 0 ? naturalWidth: naturalWidth / image.width;
    // const scaleY = naturalHeight > 0 ? naturalHeight: naturalHeight / image.height;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "low";
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As Base64 string
    const base64Image = canvas.toDataURL("image/jpeg");

    //const croppedImg = getCroppedImg(imgRef.current, crop, imageFileName);
    var files = { base64: base64Image, fileList: imgRef.current, type: "" };
    setFile(files);

    return base64Image;
  }

  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
          <h3 className="margin_bottom_25">Info</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 flush text-center col-sm-3 col-xs-12">
          <div className="col-lg-12 text-center col-sm-12 col-xs-12">
            <div className="user col-12 ">
              {/* {(!displayImage&&chageimage)&&
                <ReactCrop
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                style={{
                  width: 200,
                  height: 230,
                }}
              />
              } */}

              <br></br>
              <br></br>
              {/* {
               !displayImage&&<input type="file" accept="image/" onChange={onSelectFile} style={{all: "unset"}}/> 
              } */}

              {(displayImage || imageshow) && (
                <img
                  src={fileData.base64 !=="" ? fileData.base64 : "/images/user.png"}
                  alt=""
                  height="150"
                  width="130"
                />
              )}
              {isdiplaycanvas&&<canvas
                ref={previewCanvasRef}
                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                style={{
                  width: Math.round(completedCrop?.width ?? 0),
                  height: Math.round(completedCrop?.height ?? 0),
                  marginBottom:"20px"
                }}
              />}
              {!displayImage && (
                <input
                  type="file"
                  accept="image/"
                  onChange={onSelectFile}
                  // accept="image/*"
                  style={{ all: "unset",color:"#FF7332",marginTop:"20px"}}
                />
              )}

              {IsChangetext?
               <h4
               className="size_24 color_orange weight_500 margin_bottom_15"
                onClick={handleImageUpload}
              >
                {" "}
                Upload{"   "}
              </h4>
              :<h4
              className="size_24 color_orange weight_500 margin_bottom_15"
                onClick={handleImageUpload}
              >
                {" "}
                Change photo{"   "}
              </h4>
              }
              {!displayImage && chageimage && (
                <ReactCrop
                  src={upImg}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  style={{
                    width:300,
                    height: 300,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-1 flush text-center col-sm-3 col-xs-12">
          {/* <canvas
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
            }}
          /> */}
        </div>
        <div className="col-lg-8 infs flush col-sm-6 col-xs-12">
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
                name="phone"
                onChange={disableChange}
                value={values.phone}
                style={{caretColor:"transparent"}}
              />
              <label className="formlabel">Phone</label>
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="col-lg-8 col-sm-8 col-xs-12">
              <input
                className="emailid"
                type="text"
                placeholder="Email"
                name="emailId"
                required
                onChange={handleChange}
                value={values.emailId}
              />
              <label className="formlabel">Email</label>
              {errors.emailId && (
                <span className="error">{errors.emailId}</span>
              )}
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
                {errors.newpassword && (
                  <span className="error">{errors.newpassword}</span>
                )}
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
                {errors.confirmpassword && (
                  <span className="error">{errors.confirmpassword}</span>
                )}
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-12 col-sm-12 text-center col-xs-12">
              {submitting ? (
                <Custombutton
                  buttonText="Processing..."
                  buttonclass="blue_btn blue_btn_porder width_400"
                  isDisable={true}
                  buttonMethod={handleSubmit}
                  disabledClass="blue_btn blue_btn_porder width_400 disabled_class"
                />
              ) : (
                <Custombutton
                  buttonText="Save My Details"
                  buttonclass="blue_btn blue_btn_porder width_400"
                  isDisable={isDisabled}
                  buttonMethod={handleSubmit}
                  disabledClass="blue_btn blue_btn_porder width_400 disabled_class"
                />
              )}
            </div>
          </div>
         <MyAddressesComponent />
        </div>
      </div>
    </>
  );
};

export default MyAccountInfoComponent;
