import axios, { AxiosError } from "axios";
import { useState } from "react";
import Loader from "./Loader";

interface Props {
  ASTRO_BACKEND_URL: string;
  ASTRO_FRONTEND_URL: string;
}

const RegisterForm = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});
      
      const res = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/local/register`, {
        ...formData
      }).then((res) => {
        setLoading(false);
        location.replace(props.ASTRO_FRONTEND_URL + '/login');
      }).catch((err) => {
        console.log(err)
        setResponseMessage(err.response.data.error.message)
        setLoading(false);
      });
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={register}>
      <div className="my-2">
        <label>Username</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700" 
          required 
        />
      </div>
      <div className="my-2">
        <label>Email</label>
        <input 
          type="email" id="email" name="email" 
          className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700" 
          required 
        />
      </div>
      <div className="my-2">
        <label>Password</label>
        <input 
          type="password"
          id="password" name="password" 
          autoComplete="off"
          className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700" 
          required 
        />
      </div>
      {responseMessage && <p className="text-red-500">{responseMessage}</p>}
      <button type="submit" className="self-center text-custom-200 bg-custom-300 w-1/2 rounded-md py-2">{loading ? <Loader class="relative m-auto " /> : "Register"}</button>
    </form>
  );
}

export default RegisterForm