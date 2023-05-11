import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { set } from "astro/zod";

interface Props {
  api: string;
  postId: number;
  ASTRO_BACKEND_URL: string;
}

const Likes = (props: Props) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<any>({});
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const getLikes = async () => {
      const decodedJwt: {id: number, iat: number, exp: number} = jwtDecode(sessionStorage.getItem("jwt")!);
      await getLiked(decodedJwt.id);
      console.log(props.api);
      // const likes =  await axios.get(`${props.ASTRO_BACKEND_URL}/api/likes?populate=*&filters[api][$eq]=${props.api}&filters[postId][$eq]=${props.postId}&filters[liked][$eq]=true`);
      const countLikes = await axios.get(`${props.ASTRO_BACKEND_URL}/api/likes/count-likes/${props.api}/${props.postId}`)
      return countLikes
    };

    (async () => {
      try {
        const likes: any = await getLikes();
        setLikes(likes.data)
      } catch(err) {
        setResponseMessage("")
      }
    })();
  }, []);

  const getLiked = async (id: number) => {
    try {
      const liked = await axios.get(`${props.ASTRO_BACKEND_URL}/api/likes?populate=*&filters[api][$eq]=${props.api}&filters[postId][$eq]=${props.postId}&filters[userId][$eq]=${id}`);
      console.log(liked.data);
      if(liked.data.data.length === 1)
        setLiked(liked.data.data[0])
      else
        setLiked
        
    } catch(err) {
      setResponseMessage("There was an error fetching the amount of likes.");
    }
  }

  const like = async () => {
    const decodedJwt: {id: number, iat: number, exp: number} = jwtDecode(sessionStorage.getItem("jwt")!);
    try {
      if(Object.keys(liked).length === 0) {
        const setLike = await axios.post(`${props.ASTRO_BACKEND_URL}/api/likes`, {
          liked: true,
          userId: decodedJwt.id,
          api: props.api,
          postId: props.postId
        }, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
          }
        });
        setLikes((likes: number) => {
          return likes + 1;
        })
        getLiked(decodedJwt.id);
      } else {
        const setLike = await axios.put(`${props.ASTRO_BACKEND_URL}/api/likes`, {
          liked: !liked.attributes.liked,
          userId: decodedJwt.id,
          api: props.api,
          postId: props.postId
        }, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
          }
        });
        setLikes((likes: number) => {
          if(liked.attributes.liked) {
            return likes - 1;
          } else {
            return likes + 1;
          }
        })
        setLiked((liked: any) => {
          let state = {...liked};
          let { attributes } = liked;
          attributes.liked = !liked.attributes.liked;
          state.attributes = attributes;
          return state;
        });
      }
    } catch(err) {
      setResponseMessage("Please login to leave a like.");
    }
  }

  return (
    <div>
      <p className="font-extrabold">Likes</p>
      <button 
        className={`${Object.keys(liked).length > 0 ? (liked.attributes.liked ? 'text-red-400 hover:text-red-400' : 'text-custom-200') : 'text-custom-200'} hover:text-black hover:bg-green-300 text-6xl bg-custom-300 px-1 py-2 rounded-full`} 
        onClick={async () => like()}
      >{'<3'}</button>
      <span> {likes}</span>
      <p className="text-red-500">{responseMessage}</p>
    </div>
  )
}

export default Likes;