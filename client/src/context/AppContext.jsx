import axios from "axios";
import { createContext ,useEffect,useState} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async ()=>{  // when the app re-loads, check if the user is logged in
        try {
            const {data} = await axios.get(backendUrl + "/api/auth/is-auth");
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{getAuthState()},[]); // written in AppContextProvider and is mounted to mains.jsx

    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + "/api/user/data");
            if(data.success){
                setUserData(data.userData);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
                toast.error(error.message);
        }
    }

    const sendVerifyOtp = async ()=>{
    try {
      localStorage.setItem("otpSent","false");
      navigate("/email-verify");

      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if(data.success){
        localStorage.setItem("otpSent","true");
        toast.success(data.message);
        navigate("/email-verify");
      }
      else{
        toast.error(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData , getAuthState,
        sendVerifyOtp
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
