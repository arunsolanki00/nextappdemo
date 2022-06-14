import React, { useState } from "react";
import { TestimonialServices } from "../../redux/testimonial/testimonial.services";
import useForm from "../Common/custom-hooks/useForm";
import validate from "../testimonial/testimonial-add.validationRules";
import handleNotify from "../helpers/toaster/toaster-notify";
import { ToasterPositions } from "../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../helpers/toaster/toaster-types";
import { CustomInputButton } from "../Common/button/custominputbutton";

const TestimonialAddComponent = (props) => {
  const { restaurantId, locationId, customerId,updateList } = props;
  const { values, errors, handleChange, handleSubmit,handleCustomChange,isDisabled} = useForm(
    submitSuccess,
    validate
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMesssage] = useState(null);

  function submitSuccess() {
    const addTestimonialObj = {
      user: {
        name: values.name.trim(),
        email: values.email.trim(),
        phone:values.custom_testimonial_phone.trim(),
        comment: values.comment.trim(),
      },
    };
    submitData(addTestimonialObj);
  }

  const resetForm = ()=>{
    values.name= "";
    values.email= "";
    values.custom_testimonial_phone ="";
    values.comment = "";
    errors.custom_testimonial_phone="";
    errors.name="";
    errors.email="";
    errors.comment="";
    return;
  }

  const submitData = async (addTestimonialObj) => {
    if (addTestimonialObj != undefined) {
      setSubmitting(true);
      const responsedata = await TestimonialServices.addTestimonial(
        addTestimonialObj.user.name,
        addTestimonialObj.user.email,
        addTestimonialObj.user.phone,
        addTestimonialObj.user.comment,
        restaurantId,
        customerId,
        locationId
      );
      if (responsedata.message.length > 0) {
        console.log("responsedata.message"+responsedata.message)
        handleNotify('Testimonial added successfully!', ToasterPositions.TopRight, ToasterTypes.Success);
        setSubmitting(false);
        resetForm();
        updateList();
      } else {
        setErrorMesssage(responsedata.message);
        handleNotify(responsedata.message, ToasterPositions.TopRight, ToasterTypes.Success);
        return;
      }
    }
  };

   return (
    <>
      <div>
        <div className="row">
          <div className="col-lg-12 h1-margin pull-right flush-right xsnoflush col-sm-12 col-xs-12">
            <h1 className="margin_top_0px size_22 margin_bottom_20">
              Write Testimonial
            </h1>
          </div>
        </div>
        <form className="customForm">
          <div clas="infs">
            <div className="row">
              <div className="col-lg-4 col-sm-4 col-xs-12 flush-right">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                />
                <label className="formlabel">Your Name</label>
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="col-lg-4 col-sm-4 col-xs-12 flush-right">
                <input
                  type="text"
                  placeholder="Your Number"
                  required
                  onChange={handleCustomChange}
                  value={values.custom_testimonial_phone}
                  name="custom_testimonial_phone"
                />
                <label className="formlabel">Your Number</label>
                {errors.custom_testimonial_phone && <span className="error">{errors.custom_testimonial_phone}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 col-sm-8 col-xs-12 flush-right">
                <input
                  type="text"
                  placeholder="Your Email"
                  required
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                />
                <label className="formlabel">Your Email</label>
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 col-sm-8 col-xs-12 flush-right">
                <textarea
                  placeholder="Your Comments"
                  required
                  onChange={handleChange}
                  value={values.comment}
                  name="comment"
                />
                <label className="formlabel">Your Comments</label>
                {errors.comment && (
                  <span className="error">{errors.comment}</span>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-2 col-sm-2 col-xs-12 flush-right">
                <CustomInputButton buttonText="Submit" buttonType="button" buttonClass="orange_btn_submit padding_left_0 color_white" disabledClass="orange_submit_disabled padding_left_0 color_white" isDisable={isDisabled} buttonMethod={handleSubmit}/>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default TestimonialAddComponent;