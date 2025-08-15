import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets.js"
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
    const {backendUrl , setIsLoggedIn , getUserData} = useContext(AppContext);

    const [state,setState] = useState("Sign Up");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const onSubmitHandler = async (e) =>{

      const toastId = toast.loading("Connecting ...");

      try {
        e.preventDefault() // Prevent page refresh

        axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

        if(state === "Sign Up"){
          const {data} = await axios.post(backendUrl + "/api/auth/register" , {name,email,password});
          if(data.success){

            // toast.dismiss(toastId);
            // setTimeout(()=>{
            //   toast.success(data.message);
            // },100);
            toast.update(toastId,{
              autoClose : 2000,
              render : data.message,
              type : "success",
              isLoading : false
            })

            setIsLoggedIn(true);
            getUserData(); // Fetch user data after registration
            navigate("/");
          }
          else{
            //alert(data.message);
            toast.update(toastId,{
              autoClose : 2000,
              render : data.message,
              type : "error",
              isLoading : false
            })
          }
        }
        else{
          const {data} = await axios.post(backendUrl + "/api/auth/login" , {email,password});
          if(data.success){

            toast.update(toastId,{
              autoClose : 2000,
              render : data.message,
              type : "success",
              isLoading : false
            })

            setIsLoggedIn(true);
            getUserData(); // Fetch user data after login
            navigate("/");
          }
          else{
            //alert(data.message);
            toast.update(toastId,{
              autoClose : 2000,
              render : data.message,
              type : "error",
              isLoading : false
            })
          }
        }
      } catch (error) {
        //alert(error.message);
        toast.update(toastId,{
          autoClose : 2000,
          render : error.message,
          type : "error",
          isLoading : false
        })
      }
    }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0  bg-[url("/bg_img.jpg")] bg-cover bg-center'>
      
      <h1 onClick={()=>navigate("/")} className="w-28 sm:w-32 text-center text-white absolute left-5 sm:left-20 top-5 cursor-pointer border border-gray-100 rounded-full px-2 py-2 hover:text-black hover:bg-blue-50  transition-all">Home</h1>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create your Account" : "Login into your account!"}</p>

        <form onSubmit={onSubmitHandler} >

          {state == "Sign Up" && 
          (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="" />
            <input value={name} onChange={(e)=>setName(e.target.value)} className="bg-transparent outline-none" type="text" placeholder='Full Name' required />
          </div>)
      }

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="bg-transparent outline-none" type="email" placeholder='Email Id' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} className="bg-transparent outline-none" type="password" placeholder='Password' required />
          </div>

          {(state === "Login") && (<p onClick={()=>navigate("/reset-password")} className='text-indigo-500 mb-4 cursor-pointer'>Forgot password?</p>)}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-900 text-white font-medium cursor-pointer">{state}</button>
        </form>

        {state === "Sign Up" ? 
        (<p className="text-gray-400 text-center mt-4 text-xs">Already have an account ? {" "} <span onClick={()=>setState("Login")} className='text-blue-400 cursor-pointer underline'>Login Here</span></p>)
         : (<p className="text-gray-400 text-center mt-4 text-xs">Don't have an account ? {" "} <span onClick={()=>setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign Up</span></p>)
        }
      </div>

    </div>
  )
}

export default Login