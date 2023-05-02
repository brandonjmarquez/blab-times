import axios, { AxiosError } from "axios";
import { useState } from "react";

const RegisterForm = () => {
  const [responseMessage, setResponseMessage] = useState("");

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});
    try {
      const response = await axios.post(`${import.meta.env.REACT_APP_BACKEND_URL}/api/auth/local/register`, {
        ...formData
      });
      const { data } = await response;
    } catch(err: any) {
      setResponseMessage(err.response.data.error.message)
    }
    
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
      <button className="self-center text-custom-200 bg-custom-300 w-1/2 rounded-md py-2">Send</button>
    </form>
  );
}

export default RegisterForm