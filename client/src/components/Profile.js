import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import useFetch from '../hooks/hook';
import style from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';
import {Toaster,toast} from 'react-hot-toast';
import { useFormik } from 'formik';
import { getusername } from "../helper/helper";
import {profileValidation} from '../helper/validate';
import { useAuthStore } from '../store/store';
import converttobase from '../helper/Convert';
import { updateUser } from '../helper/helper';
export default function Profile() {
  const navigate=useNavigate();
    /**formik does not support the file upload so we need to create the handler */
const [file,setfile]=useState();
const {username}=useAuthStore(state => state.auth);
// const user= getusername();

const [{isLoading,apiData,serverError}]= useFetch({username});
const onupload=async e=>{
const base64=await converttobase(e.target.files[0]);
setfile(base64);
}
function userLogout(){
  localStorage.removeItem('token');
  navigate('/')
}
    const formik=useFormik({
        initialValues:{
          username:apiData?.username||'username',
          mobile:apiData?.mobile||'mobile',
          email:apiData?.email||'email',
         address:apiData?.address||'address'
        },
        enableReinitialize:true,
        validate:profileValidation,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit:async values=>{
            values=await Object.assign(values,{profile:file|| apiData.profile || ' '});
            let updatePromise=updateUser(values);
            toast.promise(updatePromise,{
              loading:'Checking...',
              success:<b>Profile updated Successfully....!</b>,
              error:<b>Profile not updated</b>
          });
            console.log(values);
        }
    });
     const img="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";
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
if(serverError) return <h1 className='text-xl text-red-500 '>{serverError.message}</h1>;
  return (
   <div className="container max-auto">
    <Toaster position='top-center'reverseOrder={false}></Toaster>
    <div className='flex justify-center items-center h-screen'>
        <div className={`${style.glass} ${extend.glass}`} style={{width:'45%',height:'95%',paddingTop:'1cm'}}>
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>
                Profile
            </h4>
            <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
               You can update the details
            </span>
            <form className='py-1' onSubmit={formik.handleSubmit}>
<div className='profile flex justify-center py-5'>
  <label htmlFor='profile'>
  {/* <img className={`${style.profile_img} ${extend.profile_img}`} src={ apiData?.profile || file || avatar} alt="avatar" /> */}
  <img src={`data:image/png;base64,${img}`|| avatar } className={style.profile_img}  alt="avatar" />
  </label>
  <input onChange={onupload} type='file' id='profile' name='profile'/>
</div>
<div className="textbox flex flex-col items-center gap-5">
 
  <input {...formik.getFieldProps('username')}className={`${style.textbox} ${extend.textbox}`} type='text' placeholder='Username'/>
 
  <input {...formik.getFieldProps('email')}className={`${style.textbox} ${extend.textbox}`} type='email' placeholder='Email'/>
  
  <button type='submit' className={style.btn}>Update</button>
   
</div>
<div className="text-center">
    <span className='text-gray-500'>Come back later?  <button onClick={userLogout} className='text-red-500' >Logout</button></span>
</div>
</form>
        </div>
        </div>
    </div>
   </div>
  )
}
