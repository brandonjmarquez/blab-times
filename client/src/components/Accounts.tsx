import { MouseEvent, useEffect, useState } from "react";
import PasswordReset from "./PasswordReset";
import axios from "axios";

interface Props {
  ASTRO_BACKEND_URL: string;
}

const Accounts = (props: Props) => {
  const [userData, setUserData] = useState<any>();
  const [responseMessage, setResponseMessage] = useState("");
  
  const getMe = async () => {
    try {
      const me = await axios.get(`${props.ASTRO_BACKEND_URL}/api/users/me`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
      }});
      const { data } = me;
      setUserData(data)
    } catch(err) {
      console.log(err)
    }
  }

  const changePassword = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const resetPw = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/forgot-password`, {
        email: userData.email
      })
      setResponseMessage("Password reset email successfully sent.");
    } catch(err: any) {
      console.log("An error occured: ", err.response)
    }
  }
  useEffect(() => {
    getMe();
  }, []);

  return (
    userData ? <div>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <p>Email Confirmed: {userData.confirmed ? "Confirmed" : "Unconfirmed"}</p>
      <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={changePassword}>Reset Password</button>
      {responseMessage && <p className="text-red-500">{responseMessage}</p>}
      <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md mx-2" onClick={() => {sessionStorage.removeItem("jwt"); location.replace("/")}}>Logout</button>
    </div>
     : 
    <div>
      Loading user details...
    </div>
  )
}

export default Accounts;