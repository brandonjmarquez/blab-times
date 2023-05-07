import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import axios from 'axios';

interface Props {
  title: string;
  ASTRO_BACKEND_URL: string;
}

const Header = (props: Props) => {
  const [pathname, setPathname] = useState<string>()
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    if(location.hash.length > 0) {
      setPathname(location.hash.substring(1))
    } else {
      setPathname(location.pathname);
    }
    const login = async () => {
      try {
        const res = await axios.get(`${props.ASTRO_BACKEND_URL}/api/users/me`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
        }})
          await setUserData(res.data)
      } catch(err) {
        console.error(err)
      }
    }
    if(sessionStorage.getItem("jwt"))
      login();
  }, [])

  return (
    <header className="sticky top-0 w-full bg-custom-100 px-5 md:px-20 pt-3">
      <div className="flex justify-between mx-auto my-0">
        <h3 className='text-4xl text-custom-300'>
          <a href="/" className="">
            {props.title}
          </a>
        </h3>
        <div className='min-[1090px]:block hidden w-3/4'>
          <nav>
            <Navbar collapsed={false} />
          </nav>
        </div>
        <div className="flex flex-row">
          <div className='max-[1089px]:block hidden'>
            <nav>
              <Navbar collapsed={true} />
            </nav>
          </div>
          {/* <button onClick={() => {window.sessionStorage.clear(); location.reload()}}>Logout<p>{userData.username}</p></button> */}
        </div>
      </div>
      <hr></hr>
    </header>
  );
};

export default Header;