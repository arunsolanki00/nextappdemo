import React from 'react'

export const decimalValidate = (value) => {
    const validateinteger = new RegExp(/^[0-9]*(\.\d{0,1})*$/);
    if (validateinteger.test(value)) {
        return true
    }
}

export const numberValidate = (value) => {
    const validdecimal = new RegExp(/^[0-9\b ]+$/);
    if (validdecimal.test(value)) {
        return true
    }
}
export const dateValidate = (value) => {
    //const validdecimal = new RegExp(/^[0-9\b\/]+$/);
    // const validdecimal=new RegExp(/^(?=[0-9,]*[\/][0-9,]*$)[0-9,\/]+$/);
    // if (/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)) {

        const validdecimal = new RegExp(/^[0-9\b ]+$/);
        
    if (validdecimal.test(value)) {
         
        let currentYear = new Date().getFullYear().toString().substr(-2);
        let currentMonth = new Date().getMonth()+1;

        if(value.length === 2)
        {
            let mm = value.toString().substring(0,2);
            
            if(mm > 12) 
            return false;    
        else
            return true;
        }
        else if(value.length === 4)
        {
            let month= value.toString().substring(0,2);
            let year= value.toString().substring(2);
    
            if(year === currentYear)
            {
                if(month >= currentMonth)
                    return true;    
                else return false;    

            } else if(year > currentYear)
                return true;
            else
                return false;
        } else {
        return true;
    }
    }
     else {
         return false;
     }
}
export const characterValid = (value) => {
    const validchar = new RegExp(/^[a-zA-Z]+$/)
    if (validchar.test(value)) {
        return true
    }
}


export const checkCardType=(cardnumber) => {
  let cardtype=0;
  var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  var amexpRegEx = /^(?:3[47][0-9]{13})$/;
  var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  var isValid = false;

  if (visaRegEx.test(cardnumber.replace(/\s+/g, ''))) {
    return cardtype=1;
  } else if(mastercardRegEx.test(cardnumber.replace(/\s+/g, ''))) {
   return cardtype=2;
  } else if(amexpRegEx.test(cardnumber.replace(/\s+/g, ''))) {
    return cardtype=3;
  } else if(discovRegEx.test(cardnumber.replace(/\s+/g, ''))) {
   return cardtype=4;
  }
  return 0;
}