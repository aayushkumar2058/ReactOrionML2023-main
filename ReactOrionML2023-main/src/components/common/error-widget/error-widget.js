import React, { useEffect } from 'react'
import { CombineLatestSubscriber } from 'rxjs/internal/observable/combineLatest';
import classes from './error.module.css';
import { BiErrorCircle } from "react-icons/bi";

function ErrorWidget(props) {

    console.log('Inner Widget' ,props)

    // useEffect(()=>{

    // },[props])
  return (
    
    <>
   <div className='errorWrapper'>
   {props.error?<div className={`${classes.errorWrapper} pattern-diagonal-lines-sm`}><span className='textColorRed'><BiErrorCircle></BiErrorCircle> {props.error}</span></div>:''}
   </div>
    </>
   
  )
}

export default ErrorWidget