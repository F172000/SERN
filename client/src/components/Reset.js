import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import style from '../styles/Username.module.css';
import {Toaster,toast} from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPassword } from '../helper/helper';
import {resetPasswordValidation} from '../helper/validate';
import { useAuthStore } from '../store/store';
import useFetch from '../hooks/hook';
export default function Reset() {
    const navigate=useNavigate();
//    const [{isLoading,apiData,serverError}]= useFetch(`/CreateResetSession`)
    const {username}=useAuthStore(state=>state.auth);
    const formik=useFormik({
        initialValues:{
password:'',
confirmpassword:''
        },
        validate:resetPasswordValidation,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit:async values=>{
            console.log(values);
            let resetPromise=resetPassword({username,password:values.password});
            toast.promise(resetPromise,{
                loading:'Updating...',
                success:<b>Password reset successfully....!</b>,
                error:<b>Couldn't reset password</b>
            });
            resetPromise.then(function(){navigate('/password')});
        }
    });

  return (
   <div className="container max-auto">
    <Toaster position='top-center'reverseOrder={false}></Toaster>
    <div className='flex justify-center items-center h-screen'>
        <div className={style.glass} >
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>
                Reset
            </h4>
            <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
                Enter new password.
            </span>
            <form className='py-20' onSubmit={formik.handleSubmit}>
{/* <div className='profile flex justify-center py-4'>
<img className={style.profile_img} src={avatar} alt="avatar" />
</div> */}
<div className="textbox flex flex-col items-center gap-6">
<input {...formik.getFieldProps('password')}className={style.textbox} type='password' placeholder='New Password'/>
    <input {...formik.getFieldProps('confirmpassword')}className={style.textbox} type='password' placeholder='Repeat Password'/>
    <button type='submit' className={style.btn}>Reset</button>
</div>
<div className="text-center py-2">
    <span className='text-gray-500'>Forgot Password?<Link className='text-red-500' to='/recovery'>Recover Now </Link></span>
</div>
</form>
        </div>
        </div>
    </div>
   </div>
  )
}

