import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";

interface Props {
  ASTRO_BACKEND_URL: string;
}

const EmailForPwReset = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});

    try {
      const res = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/forgot-password`, {
        ...formData
      }).then((res) => {
        setLoading(false)
        const { jwt, user } = res.data;
        window.sessionStorage.setItem('jwt', jwt);
        setResponseMessage("Email successfully sent.")
      });
    } catch(err: any) {
      setResponseMessage(err.response.data.error.message)
    }
  }

  return (
    <>
      <form onSubmit={sendEmail} className="flex flex-col justify-center">
        <label className="font-bold mb-5 mr-3">Email</label>
        <input 
          type="email"
          id="email"
          name="email"
          className="text-sm outline-none pb-5 border-b rounded-md hover:border-blue-700 focus:border-blue-700"
          autoComplete="off"
        ></input>
        <button type="submit" className="self-center text-custom-200 bg-custom-300 w-1/2 rounded-md py-2 m-2">{loading ? <Loader class="relative m-auto " /> : "Submit"}</button>
      </form>
      {responseMessage && <p className="text-red-500 text-center">{responseMessage}</p>}
    </>
  )
}

export default EmailForPwReset;