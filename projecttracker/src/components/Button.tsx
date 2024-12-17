import React from 'react'

interface buttonProps{
className:string,
text:string,
onClickListner:()=>void; 
}

const Button = ({className,text,onClickListner}:buttonProps) => {
  return (
    <button onClick={onClickListner} className={`${className} px-3 py-2`}>
       {text} 
    </button>
  )
}

export default Button
