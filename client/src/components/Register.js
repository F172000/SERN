import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import avatar from '../assets/profile1.jpg';
import style from '../styles/Username.module.css';
import {Toaster,toast} from 'react-hot-toast';
import { useFormik } from 'formik';
import {registerValidation} from '../helper/validate';
import converttobase from '../helper/Convert';
import {register} from '../helper/helper';
import { useNavigate } from 'react-router-dom';
export default function Password() {
    const navigate=useNavigate();
    /**formik does not support the file upload so we need to create the handler */
const [file,setfile]=useState();
const onupload=async e=>{
// const base64=await converttobase(e.target.files[0]);
// setfile(base64);
const file = e.target.files[0];

if (file) {
  const reader = new FileReader();

  reader.onloadend = () => {
    console.log(reader.result);
    setfile(reader.result);
  };

  reader.readAsDataURL(file);
}
}
    const formik=useFormik({
        initialValues:{
          email:'',
          username:'',
          password:''
        },
        validate:registerValidation,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit:async values=>{
            values= await Object.assign(values,{profile:file||' '});
            console.log(values);
            const registeruser=register(values);
            toast.promise(registeruser,{
                loading:'Creating...',
                success:<b>Register Successfully!</b>,
                error:<b>Could not register</b>
            });
            registeruser.then(function(){navigate('/')});
        }
    });
  return (
   <div className="container max-auto">
    <Toaster position='top-center'reverseOrder={false}></Toaster>
    <div className='flex justify-center items-center h-screen'>
        <div className={style.glass} style={{height:'95%',paddingTop:'1cm'}}>
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>
                Register
            </h4>
            <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
               Happy to join you!
            </span>
            <form className='py-1' onSubmit={formik.handleSubmit}>
<div className='profile flex justify-center py-3'>
  <label htmlFor='profile'>
  <img className={style.profile_img} src={ file || avatar} alt="avatar" />
  </label>
  <input onChange={onupload} type='file' id='profile' name='profile'/>
</div>
<div className="textbox flex flex-col items-center gap-5">
    <input {...formik.getFieldProps('email')}className={style.textbox} type='email' placeholder='Email*'/>
    <input {...formik.getFieldProps('username')}className={style.textbox} type='text' placeholder='Username*'/>
    <input {...formik.getFieldProps('password')}className={style.textbox} type='password' placeholder='Password*'/>
    <button type='submit' className={style.btn}>Register</button>
</div>
<div className="text-center py-2">
    <span className='text-gray-500'>Already Register?  <Link className='text-red-500' to='/password'>Login </Link></span>
</div>
</form>
        </div>
        </div>
    </div>
   </div>
  )
}
