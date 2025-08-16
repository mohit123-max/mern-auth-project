import React , {useContext, useEffect, useState, useRef} from 'react'
import {assets} from "../assets/assets.js"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const {userData , setUserData , backendUrl , setIsLoggedIn , sendVerifyOtp} = useContext(AppContext);
  const [toShow , setToShow] = useState(false);
  const menuRef = useRef(null);

  

  const logout = async ()=>{
    try {
      const {data} = await axios.post(backendUrl + "/api/auth/logout");
      if(data.success){
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[]) // handling outside clicks

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 text-white '>
        
        <h1 className="w-28 sm:w-32 text-center border border-gray-100 cursor-pointer rounded-full px-2 py-2 hover:text-black hover:bg-blue-50  transition-all">Home</h1>

        {userData ? 
        (<div ref={menuRef} onClick={()=>{setToShow(!toShow)}} className="w-8 h-8 rounded-full bg-blue-800 flex justify-center items-center relative cursor-pointer">
          {userData.name[0].toUpperCase()}

          {toShow && 
          (<div className="absolute top-0 right-0 z-10 pt-10">
            <ul className="list-none m-0 p-2 text-sm bg-black whitespace-nowrap">
              {!userData.isAccountVerified && (<li onClick={sendVerifyOtp} className='py-1 px-2 hover:bg-white hover:text-black cursor-pointer'>Verify email</li>)}
              <li onClick = {logout} className='py-1 px-2 hover:bg-white hover:text-black cursor-pointer pr-10'>Log out</li>
            </ul>
          </div>)
          }

        </div>)

        :

        (<button onClick={()=>navigate("/login")} className="flex items-center cursor-pointer gap-2 border border-gray-100 rounded-full px-6 py-2 hover:text-black hover:bg-blue-50  transition-all">
            Login <img src={assets.arrow_icon} alt="" />
        </button>
        )
        }
        
    </div>
  )
}

export default Navbar