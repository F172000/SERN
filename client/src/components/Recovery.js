import React,{useState} from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import avatar from '../assets/profile.png';
import style from '../styles/Username.module.css';
import { useAuthStore } from '../store/store';
import {Toaster,toast} from 'react-hot-toast';
import { useFormik } from 'formik';
import {passwordValidate} from '../helper/validate';
import { useEffect } from 'react';
import { generateOTP ,verifyOTP} from '../helper/helper';
export default function Recovery() {
    const navigate=useNavigate();
    const {username}=useAuthStore(state=>state.auth);
    const [OTP,setOTP]=useState();
    useEffect(()=>{
generateOTP(username).then((OTP)=>{
    console.log(OTP);
    if(OTP) return toast.success('OTP has been send to your email');
    return toast.error('Problem while generating OTP');
})
    },[username]);
async function onsubmit(e){
    e.preventDefault();
    try{
        const {status}=await verifyOTP({username, code:OTP});
        if(status===201){
            toast.success('Verify successfully!');
            return navigate('/reset');
        }
    }catch(error){
        return toast.error('Wrong OTP! check email again!');
    }
}
//handler of send OTP
function resendOTP(){
    let sendPromise=generateOTP(username);
    toast.promise(sendPromise,{
        loading:'sending...',
        success:<b>OTP has been send to your email!</b>,
        error:<b>Could not send it!</b>
    });
    sendPromise.then(OTP=>{
        console.log(OTP);
    })
}
  return (
   <div className="container max-auto">
    <Toaster position='top-center'reverseOrder={false}></Toaster>
    <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>
                Recovery
            </h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Enter OTP to recover password
            </span>
            <form className='pt-20' onSubmit={onsubmit}>
{/* <div className='profile flex justify-center py-4'>
<img className={style.profile_img} src={avatar} alt="avatar" />
</div> */}
<div className="textbox flex flex-col items-center gap-6">
    <div className='input text-center'>
    <span className='py-4 text-sm text-left text-gray-500'>
        Enter 6 digit OTP sent to your email address.
    </span>
    <input onChange={(e)=>setOTP(e.target.value)} className={style.textbox} type='password' placeholder='OTP'/>
    </div>
    <button type='submit' className={style.btn}>Recover</button>
</div>
</form>
<div className="text-center py-3">
    <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
</div>
        </div>
        </div>
    </div>
   </div>
  )
}

