import React from 'react'
export const Custombutton = ({buttonText,buttonType,buttonclass,isDisable,disabledClass,buttonMethod}) => {
    return (
        <>
         {isDisable ?<button type={buttonType} className={disabledClass} disabled={isDisable}  >{buttonText}</button> 
         : <button type={buttonType} className={buttonclass} disabled={isDisable} onClick={buttonMethod}>{buttonText}</button> }
            
        </>
    )
}
