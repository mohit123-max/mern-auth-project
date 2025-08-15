import axios from 'axios';
import { assets } from '../assets/assets.js';
import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


const EmailVerify = () => {
  const navigate = useNavigate();
  const {backendUrl , userData , getUserData , sendVerifyOtp} = useContext(AppContext);

  if(userData.isAccountVerified){
    navigate("/");
  }



  const inputRefs = useRef([]); // store dom node of every input tag ;     // when a fn is passed to ref attribute ,instead of useRef, argument e/node is DOM node of that element

  const handleInput = (e,index)=>{
    if(e.target.value.length > 0  && inputRefs.current[index+1]){
      inputRefs.current[index+1].focus();
    }
  }

  const keyUp = (e,index)=>{
    if(e.key === "Backspace" && e.target.value=="" && inputRefs.current[index-1]){
      inputRefs.current[index-1].focus();
    }
  }

  const handlePaste = (e,index)=>{  //onPaste event
    e.preventDefault();

    const otp = e.clipboardData.getData("text");
    console.log(otp);

    let end = otp.length>6 ? 6 : otp.length;
    for(let i=0;i<end;i=i+1){
      if(index>=6) break;
      inputRefs.current[index].value = otp[i];
      index=index+1;
    }
  }

  const verifyEmail = async (e) => {
    e.preventDefault();
    let otp = "";
    for(let i=0;i<6;i++){
      otp = otp + inputRefs.current[i].value;  
    }

    try {
      const {data} = await axios.post(backendUrl + "/api/auth/verify-account",{otp});
      if(data.success){
        localStorage.setItem("otpSent","false");
        getUserData();
        navigate("/");
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  if(localStorage.getItem("otpSent")=="false"){
    return <div className="flex justify-center items-center min-h-screen bg-[url('/bg_img.jpg')] bg-cover bg-center">
              <div className="w-20 h-20 border-5 border-white border-t-transparent rounded-full animate-spin"></div>
           </div>
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-[url("/bg_img.jpg")] bg-cover bg-center'>
      <h1 onClick={()=>navigate("/")} className="w-28 sm:w-32 text-center text-white absolute left-5 sm:left-20 top-5 cursor-pointer border border-gray-100 rounded-full px-2 py-2 hover:text-black hover:bg-blue-50  transition-all">Home</h1>

      <form onSubmit={(e)=>verifyEmail(e)} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className = "text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className='text-center text-indigo-600 mb-6'>Please enter the 6-digit OTP sent to {userData.email} to verify your account.</p>
        <div className="flex justify-between mb-8">
          {Array(6).fill(0).map((_,index)=>{
            return <input ref={(node)=>{inputRefs.current[index]=node}} onInput={(e)=>{handleInput(e,index);}} onKeyUp={(e)=>{keyUp(e,index);}} onPaste={(e)=>{handlePaste(e,index)}} type="text" maxLength="1" required key={index} className="w-12 h-12 bg-[#333A5C] text-xl text-center text-white rounded-md"/>
          })}
        </div>

        <p onClick={()=>{sendVerifyOtp()}} className='text-blue-500 mb-3 text-sm cursor-pointer'>Resend Otp ?</p>

        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">Verify Email</button>

      </form>
      
    </div>
  )
}

export default EmailVerify