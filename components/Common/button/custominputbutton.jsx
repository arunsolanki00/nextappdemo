import React from 'react'

export const CustomInputButton = ({buttonText,buttonType,buttonClass,isDisable,disabledClass,buttonMethod}) => {
    return (
        
        <>
         {isDisable ?<input type={buttonType} className={disabledClass} disabled={isDisable} value={buttonText} />
         : <input type={buttonType} className={buttonClass} disabled={isDisable} onClick={buttonMethod} value={buttonText}/>}    
        </>
        
    )
}
