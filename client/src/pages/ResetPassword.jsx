import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ResetPassword = () => {

  const navigate = useNavigate();
  const {backendUrl , getUserData , setIsLoggedIn} = useContext(AppContext);
  const [pass , setPass] = useState("password");
  const [rePass , setRePass] = useState("password");

  const [email , setEmail] = useState("");
  const [otp , setOtp] = useState("");
  const [password , setPassword] = useState("");
  const [repassword , setRepassword] = useState("");
  const [toDisplay, setToDisplay] = useState("sendOtp");

  const sendOtp = async (e)=>{
    e.preventDefault();
    const toastId = toast.loading("Connecting ....");

    try {
      const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp", {email});
      if(data.success){
        toast.update(toastId,{
        isLoading : false,
        type : "success",
        autoClose : 2000,
        render : data.message
        })
        setToDisplay("reset_password");
      }
      else{
        toast.update(toastId,{
        isLoading : false,
        type : "error",
        autoClose : 2000,
        render : data.message
      })
      }
    } catch (error) {
      toast.update(toastId,{
        isLoading : false,
        type : "error",
        autoClose : 2000,
        render : error.message
      })
    }
  }
  const submitHandler = async (e)=>{
    e.preventDefault();
    if(password !== repassword){
      toast.error("Password entered didn't match each other");
      return;
    }

    const toastId = toast.loading("Connecting ....");
    try {
      const res1 = await axios.post(backendUrl + "/api/auth/reset-password",{email,otp,newPass : password});
      if(res1.data.success){
        toast.update(toastId,{
          isLoading : false,
          type : "success",
          autoClose : 2000,
          render : res1.data.message
        })
        const res2 = await axios.post(backendUrl + "/api/auth/login",{email,password});
        if(res2.data.success){
          getUserData();
          setIsLoggedIn(true);
          navigate("/");
        }
        else{
          toast.error(res2.data.message);
        }

      }else{
        toast.update(toastId,{
        isLoading : false,
        type : "error",
        autoClose : 2000,
        render : res1.data.message
      })
      }
    } catch (error) {
      toast.update(toastId,{
        isLoading : false,
        type : "error",
        autoClose : 2000,
        render : error.message
      })
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.jpg')] bg-cover bg-center text-white">

      <h1 onClick={()=>navigate("/")} className="w-28 sm:w-32 text-center text-white absolute left-5 sm:left-20 top-5 cursor-pointer border border-gray-100 rounded-full px-2 py-2 hover:text-black hover:bg-blue-50  transition-all">Home</h1>
      <h1 className="text-3xl mb-5 font-extrabold">Password Reset</h1>

      {
        toDisplay === "sendOtp" ? 
        (<form onSubmit={sendOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon} alt="" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="bg-transparent outline-none" type="email" placeholder='Email Id' required />
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">Send Otp</button>
        </form>)

        :

      (<form onSubmit={submitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.person_icon} alt="" />
          <input value={otp} onChange={(e)=>{setOtp(e.target.value)}} className="bg-transparent outline-none" type="text" placeholder='Enter OTP' required />
        </div>

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full relative bg-[#333A5C]'>
          <img src={assets.lock_icon} alt="" />
          <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className="bg-transparent outline-none" type={pass} placeholder='Enter New Password' required />
          { pass=="password" ? (<img onClick={()=>{setPass("text")}} src={assets.pass_show} alt="" className="w-4 absolute right-5 cursor-pointer" />)
          : (<img onClick={()=>{setPass("password")}} src={assets.pass_hide} alt="" className="w-4 absolute right-5 cursor-pointer" />)
          }
        </div>

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] relative'>
          <img src={assets.lock_icon} alt="" />
          <input value={repassword} onChange={(e)=>{setRepassword(e.target.value)}} className="bg-transparent outline-none" type={rePass} placeholder='Re-enter New Password' required />
          { rePass=="password" ? (<img onClick={()=>{setRePass("text")}} src={assets.pass_show} alt="" className="w-4 absolute right-5 cursor-pointer" />)
          : (<img onClick={()=>{setRePass("password")}} src={assets.pass_hide} alt="" className="w-4 absolute right-5 cursor-pointer" />)
          }
        </div>
        
        <p onClick={()=>{setToDisplay("sendOtp")}} className='text-blue-500 mb-3 text-sm cursor-pointer'>Resend Otp ?</p>

        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">Reset Password</button>

      </form>)
      } 
    </div>
  )
}

export default ResetPassword