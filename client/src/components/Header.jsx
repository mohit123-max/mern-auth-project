import React, { useContext } from 'react'
import {assets} from "../assets/assets.js"
import { AppContext } from '../context/AppContext.jsx'
const Header = () => {
    const {userData} = useContext(AppContext);
  return (
    <div className='flex flex-col items-center text-center text-gray-50 mt-20 px-4'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6' />

        <h1 className='flex items-center gap-2 text-xl sm:text-3xl mb-2 font-bold'>
            Hey {userData !==false ? userData.name : "GuestUser"}
            <img src={assets.hand_wave} alt="" className='w-8 aspect-square' />
        </h1>

        <h2 className='text-3xl sm:text-5xl  mb-4 font-bold'>Welcome to our app</h2>
        <p className='mb-8 max-w-md font-semibold text-white-600'>Let's start with a quick product tour and we will have you up and running in no time.</p>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 hover:text-black transition-all'>Get Started</button>
    </div>
  )
}

export default Header