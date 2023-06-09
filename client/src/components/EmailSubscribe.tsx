import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";

interface Props {
  ASTRO_BACKEND_URL: string
}

const EmailSubscribe = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});

      try {
        const res = await axios.post(`${props.ASTRO_BACKEND_URL}/api/subscribeds`, {
          data: {
            ...formData
          }
        }).then((res) => { 
          setLoading(false); 
          setResponseMessage(res.data) 
        });
      } catch(err: any) {
        setResponseMessage(err.response.data.error.message)
      }
  }

  return (
    <form className="flex flex-col justify-center w-full md:w-1/2 m-auto" onSubmit={subscribe}>
      <p className="text-center">Subscribe to my posts!</p>
      <input type="email" id="email" name="email" className="rounded-3xl p-3" placeholder="Enter your email..."></input>
      <br></br>
      <button type="submit" className="text-custom-200 bg-custom-300 hover:bg-green-300 rounded-3xl p-2">{loading ? <Loader class="relative m-auto " /> : "Subscribe"}</button>
      {responseMessage && <p className="text-red-500 text-center">{responseMessage}</p>}
    </form>
  )
}

export default EmailSubscribe;