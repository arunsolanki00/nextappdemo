import { useState, useEffect } from "react";
import { characterValid, dateValidate, numberValidate } from "../../helpers/validate";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      setIsDisabled(false);
      callback();
    }
  }, [errors]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
    setIsDisabled(true);
  };

  const handleChange = (event) => {
    event.persist();

    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));

    setErrors((errors) => ({
      ...errors,
      [event.target.name]: "",
    }));

    updatevalue();
  };

  const updatevalue = () => {
    if (Object.keys(errors).length > 0) {
      setIsDisabled(false);
    }
  };

  const handleCustomChange = (event) => {
     
    event.persist();
    if (
      event.target.name === "custom_testimonial_phone" &&
      !Number(event.target.value) &&
      event.target.value !== ""
    ) {
      setValues((values) => ({
        ...values,
        [event.target.name]: "",
      }));
    }
    else {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));

      setErrors((errors) => ({
        ...errors,
        [event.target.name]: "",
      }));
      updatevalue();
    }
  };

  const handlePaymentChange = (event) => {
     
    // event.persist();
    //fillpageInfo();
    if(event.target.name === "email" || event.target.name ===  "zipcode"){
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));

      setErrors((errors) => ({
        ...errors,
        [event.target.name]: "",
      }));
    }
   else if(event.target.name === "cardnumber" &&
      numberValidate(event.target.value) &&
      event.target.value !== "" && event.target.value.length <=16)
    {
      
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));
    

      setErrors((errors) => ({
        ...errors,
        [event.target.name]: "",
      }));
      updatevalue();
    } 
    else if(event.target.name ==="expiremonthyear" && dateValidate(event.target.value)&&event.target.value.length <=5){
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));
    }
    else if(event.target.name === "cvv" &&
      numberValidate(event.target.value) &&
      event.target.value !== "" && event.target.value.length <=3)
    {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));
    }
    else if(event.target.name === "cardname" && characterValid(event.target.value)){
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));
    }
    else {
      setValues((values) => ({
        ...values,
        [event.target.name]: "",
      }));
  }
  
  };

  const fillpageInfo=()=>{
     
    setValues({email:"test@gmail.com",cardnumber:"4242424242424242",
               expiremonthyear : "20/22",cvv:123,cardname:"test",zipcode:123456});

  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    handleCustomChange,
    isDisabled,
    handlePaymentChange
  };
};

export default useForm;
