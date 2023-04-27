import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar/Navbar';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

interface Props {
  title: string;
}

const Header = (props: Props) => {
  const [pathname, setPathname] = useState<string>()
  const [jwt, setJwt] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    setPathname(window.location.pathname);
    setJwt(window.localStorage.getItem("jwt"))
  }, [])
  useEffect(() => {
    if(jwt && jwt.length > 0) {
      const getUserData = async () => {
        const response = await axios.get('http://localhost:1338/api/users/me', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        });
        setUserData(response.data);
      }
      getUserData();
    } else {
      setUserData(null)
    }
  }, [jwt]);
  return (
    <header>
      <div className="flex justify-center mx-auto my-0">
        <h3 className='text-5xl'>
          <a href="/" className="text-black">
            {props.title}
          </a>
        </h3>
        <Navbar />
        {userData ? <div className="flex flex-col"><button onClick={() => {window.localStorage.clear(); setJwt(null)}}>Logout<p>{userData.username}</p></button></div> : <a href={`/login#${pathname}`} className="text-custom-200">Login</a>}
      </div>
      <hr></hr>
    </header>
  );
};

export default Header;