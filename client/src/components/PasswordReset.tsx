import axios from "axios";
import queryString from "query-string";

interface Props {
  ASTRO_BACKEND_URL: string;
  ASTRO_FRONTEND_URL: string;
}

const PasswordReset = (props: Props) => {

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});

      try {
      const qs = queryString.parse(location.search)
      const resetPw = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/reset-password`, {
        code: qs.code,
        ...formData
      })

      location.replace(props.ASTRO_FRONTEND_URL + '/login')
    } catch(err: any) {
      console.log('An error occurred: ', err.response)
    }
  }
  return (
    <form onSubmit={changePassword} className="flex flex-col justify-center">
      <label htmlFor="password">Password: </label>
      <input id="password" type="password" name="password" className="text-sm outline-none pb-5 border-b rounded-md hover:border-blue-700 focus:border-blue-700 my-2" autoComplete="off" required></input>
      <br></br>
      <label htmlFor="passwordConfirmation">Confirm Password: </label>
      <input id="passwordConfirmation" name="passwordConfirmation" type="password" className="text-sm outline-none pb-5 border-b rounded-md hover:border-blue-700 focus:border-blue-700" autoComplete="off" required></input>
      <br></br>
      <button type="submit" className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md">Submit</button>
    </form>
  )
}

export default PasswordReset;