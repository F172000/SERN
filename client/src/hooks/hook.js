import axios from "axios";
import { useEffect, useState } from "react";
import { getUser } from "../helper/helper";
import { getusername } from "../helper/helper";
axios.defaults.baseURL=process.env.REACT_APP_SERVER_DOMAIN;
//custom hook
export default function useFetch({username}){
   const [getdata,setdata]= useState({isLoading:false,apiData:undefined,status:null,serverError:null});
   useEffect(()=>{
   //  if(!{username}) {
   //      return;
   //  }
    const fetchData=async()=>{
        try{
             setdata(prev=>({...prev,isLoading:true}));
            //  const {username}=await getusername();
            //  const user={username}
            //  console.log({username});
             const {data,status}=await getUser({username});
             console.log({data,status});
             if(status===201){
                setdata(prev=>({...prev, isLoading : false}));
                setdata(prev=>({...prev, apiData : data, status : status}));
             }
        }catch(error){
           setdata(prev=>({...prev,isLoading:false,serverError:error}));
        }
    }
    fetchData();
   },[username]);
   return [getdata,setdata];
}