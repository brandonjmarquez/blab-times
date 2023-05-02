import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import axios from 'axios';

interface Props {
  title: string;
}

const Header = (props: Props) => {
  const [pathname, setPathname] = useState<string>()
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    setPathname(window.location.pathname);
    const login = async () => {
      let jwt = await axios.get(`${import.meta.env.REACT_APP_BACKEND_URL}/api/users/me`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      }})
        .then((res) => {console.log(res.data); setUserData(res.data)})
        .catch((err) => console.error(err));
    }
    if(localStorage.getItem("jwt"))
      login();
    
  }, [])

  return (
    <header>
      <div className="flex justify-center mx-auto my-0">
        <h3 className='text-5xl text-custom-300'>
          <a href="/" className="">
            {props.title}
          </a>
        </h3>
        <Navbar />
        {userData ? <div className="flex flex-col"><button onClick={() => {window.localStorage.clear(); location.reload()}}>Logout<p>{userData.username}</p></button></div> : <a href={`/login#${pathname}`} className="text-custom-200">Login</a>}
      </div>
      <hr></hr>
    </header>
  );
};

export default Header;