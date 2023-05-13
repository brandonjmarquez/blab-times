import axios from "axios";
import jwtDecode from "jwt-decode";
import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  ASTRO_BACKEND_URL: string;
}

const Unsubscribe = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = async (e: ChangeEvent) => {
    if(isSubscribed) {
      const subscribe = await axios.delete(`${props.ASTRO_BACKEND_URL}/api/subscribeds/${location.hash.substring(1)}`)
        .then((res) => {setIsSubscribed(!(e.target as HTMLInputElement).checked); setResponseMessage(res.data)})
    } else {
      const subscribe = await axios.post(`${props.ASTRO_BACKEND_URL}/api/subscribeds`, {
        data: {
          email: location.hash.substring(1)
        }
      }).then((res) => {setIsSubscribed(!(e.target as HTMLInputElement).checked); setResponseMessage(res.data)})
    }
  }

  const getMe = async () => {
    const me = await axios.get(`${props.ASTRO_BACKEND_URL}/api/subscribeds/${location.hash.substring(1)}`)
    .then((res) => {
      const { data } = res;
      setIsSubscribed(data)
    }).catch((err) => console.log(err));
  }

  useEffect(() => {
    getMe();
  }, []);

  return (
    <main>
      <p>Subscribe to post notifications: <input type="checkbox" checked={isSubscribed} onChange={subscribe}></input></p>
    </main>
  )
}

export default Unsubscribe;