export default function validate(values) {
  let errors = {};
  let cardNumberValidate= /^[0-9]{16}$/;  //   /^[0-9\b]+$/;
  let cardMonthYearValidate= /^[0-9]{16}$/; 
  let numberValidate = /^[0-9\b]+$/;

  var today = new Date();

   ;
  // if (!values.name) {
  //   errors.name = "Name is required";
  // }
  if (!values.email) {
    errors.email = "Email address is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }
  
  if (!values.cardnumber) {
    errors.cardnumber = "Card Number is required";
  } else if(!cardNumberValidate.test(values.cardnumber.replace(/\s+/g, '')))
  {
      errors.cardnumber = "Card Number is not valid";
  }
  
  if (!values.expiremonthyear) {
    errors.expiremonthyear = "Expire time is required";
  }

  
  let expiry = values.expiremonthyear.split('/')
  let currentyear= today.getFullYear().toString().substr(2);

 
  if(currentyear > parseInt(expiry[1])) {
    errors.expiremonthyear = "Expire time is not valid";
  }

  if(currentyear == parseInt(expiry[0]) && today.getMonth() < parseInt(expiry[0]))
  {
    errors.expiremonthyear = "Expire time is not valid";
  }
 
  if (!values.cvv) {
    errors.cvv = "CVV Number is required";
  } else if(!numberValidate.test(values.cvv))
  {
      errors.cvv = "CVV is not valid";
  }
  if (!values.cardname) {
    errors.cardname = "Card Name is required";
  }
  if (!values.zipcode) {
    errors.zipcode = "Zipcode is required";
  }
  // if (!values.country) {
  //   errors.country = "Country is required";
  // }

  // var ccNum = document.getElementById("cardNum").value;
  var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  var amexpRegEx = /^(?:3[47][0-9]{13})$/;
  var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  var isValid = false;

  if (visaRegEx.test(values.cardnumber.replace(/\s+/g, ''))) {
    isValid = true;
  } else if(mastercardRegEx.test(values.cardnumber.replace(/\s+/g, ''))) {
    isValid = true;
  } else if(amexpRegEx.test(values.cardnumber.replace(/\s+/g, ''))) {
    isValid = true;
  } else if(discovRegEx.test(values.cardnumber.replace(/\s+/g, ''))) {
    isValid = true;
  }

  if(!isValid) {
     // alert("Thank You!");
     errors.cardnumber = "Card number is not valid";
  } 

   ;
  return errors;
}

