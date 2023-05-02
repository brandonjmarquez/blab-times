import axios from 'axios';
import { useEffect, useState } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState<{email: string, password: string}>({email: "", password: ""})
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isError, setIsError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setCredentials((credentials) => {
      let state = {...credentials};
      state[e.target.id as keyof typeof state] = e.target.value;

      return state;
    })
  }

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.REACT_APP_BACKEND_URL}/api/auth/local`, {
        identifier: credentials.email,
        password: credentials.password
      });
      const { jwt, user } = res.data;
      
      window.localStorage.setItem('jwt', jwt);
      window.location.replace(import.meta.env.REACT_APP_BACKEND_URL);
    } catch(err) {
      setIsError(true);
    }
  }

  useEffect(() => {
    setButtonDisabled((buttonDisabled) => {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      let state = buttonDisabled

      if(credentials.password.length > 5 ) {
        state = true;
      } else {
        state = false;
      }

      if(credentials.email.match(regex) && state) {
        state = true;
      } else {
        state = false;
      }
      return state;
    });
  }, [credentials]);

  return (
    <div>
      <form className="flex flex-col justify-center" onSubmit={login}>
        <div className="my-2">
          <label className="font-bold mb-5 mr-3">Email</label>
          <input 
            type="email"
            id="email"
            className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700"
            autoComplete="off"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <div className="my-2">
          <label className=" font-bold mb-5">Password</label>
          <input 
            type="password" 
            id="password"
            className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700"
            autoComplete="off"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        {isError && <p className="text-red-500">Invalid Email or Password.</p>}
        <button type="submit" disabled={!buttonDisabled} className={`self-center text-custom-200 bg-custom-300 w-1/2 rounded-md py-2 ${buttonDisabled ? "bg-custom-300" : "bg-red-500"}`}>Login</button>
      </form>
    </div>
  )
}

export default Login;