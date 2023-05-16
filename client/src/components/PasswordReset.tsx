import { useState } from "react";
import axios from "axios";
import queryString from "query-string";
import Loader from "./Loader";

interface Props {
  ASTRO_BACKEND_URL: string;
  ASTRO_FRONTEND_URL: string;
}

const PasswordReset = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});
      const qs = queryString.parse(location.search)
      const resetPw = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/reset-password`, {
        code: qs.code,
        ...formData
      }).then(() =>{
        setLoading(false);
        location.replace(props.ASTRO_FRONTEND_URL + '/login')
      })
      .catch((err) => setResponseMessage('An error occurred: ' + err.response.data.error.message))

      
  }
  return (
    <form onSubmit={changePassword} className="flex flex-col justify-center">
      <label htmlFor="password">Password: </label>
      <input id="password" type="password" name="password" className="text-sm outline-none pb-5 border-b rounded-md hover:border-blue-700 focus:border-blue-700 my-2" autoComplete="off" required></input>
      <br></br>
      <label htmlFor="passwordConfirmation">Confirm Password: </label>
      <input id="passwordConfirmation" name="passwordConfirmation" type="password" className="text-sm outline-none pb-5 border-b rounded-md hover:border-blue-700 focus:border-blue-700" autoComplete="off" required></input>
      <br></br>
      <button type="submit" className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md">{loading ? <Loader class="relative m-auto " /> : "Submit"}</button>
      {responseMessage && <p className="text-red-500 text-center">{responseMessage}</p>}
    </form>
  )
}

export default PasswordReset;