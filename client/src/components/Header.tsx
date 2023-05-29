import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import axios from 'axios';

interface Props {
  title: string;
  ASTRO_BACKEND_URL: string;
}

const Header = (props: Props) => {
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const login = async () => {
      try {
        const res = await axios.get(`${props.ASTRO_BACKEND_URL}/api/users/me`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
        }}).then((res) => {
          setUserData(res.data);
        }).catch((err) => {
          if(!userData)
            sessionStorage.removeItem("jwt")
          return;
        })
      } catch(err) {
        console.error(err)
      }
    }
    if(sessionStorage.getItem("jwt"))
      login();
  }, []);

  return (
    <header className="sticky top-0 w-full bg-custom-100 px-5 md:px-20 pt-3 z-10">
      <div className="flex justify-between mx-auto my-0">
        <h3 className="text-3xl sm:text-5xl text-custom-300">
          <a href="/">
            <img src="/logo.PNG" alt="blab times logo" className="inline-block w-[100px]"></img>
            <span className="max-[352px]:hidden whitespace-nowrap">{props.title}</span>
          </a>
        </h3>
        <div className="min-[1136px]:block hidden w-2/3">
          <nav>
            <Navbar collapsed={false} username={userData ? userData.username : ""} />
          </nav>
        </div>
        <div className="flex flex-row">
          <div className="max-[1135px]:block hidden">
            <nav>
              <Navbar collapsed={true} username={userData ? userData.username : ""} />
            </nav>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="flex justify-center"><hr className="w-5/6 my-0"></hr></div>
      
    </header>
  );
};

export default Header;