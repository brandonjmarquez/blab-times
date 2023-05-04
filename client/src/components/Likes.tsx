import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

interface Props {
  api: string;
  postId: number;
  REACT_APP_BACKEND_URL: string;
}

const Likes = (props: Props) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<any>({});

  useEffect(() => {
    const getLikes = async () => {
      const decodedJwt: {id: number, iat: number, exp: number} = jwtDecode(localStorage.getItem("jwt")!);
      await axios.get(`${props.REACT_APP_BACKEND_URL}/api/likes?populate=*&filters[api][$eq]=${props.api}&filters[postId][$eq]=${props.postId}&filters[users_permissions_user][id][$eq]=${decodedJwt.id}`)
        .then((res) => {
          if(res.data.data.length === 1)
            setLiked(res.data.data[0])
        })
      return await axios.get(`${props.REACT_APP_BACKEND_URL}/api/likes?populate=*&filters[api][$eq]=${props.api}&filters[postId][$eq]=${props.postId}&filters[liked][$eq]=true`);
    };

    getLikes().then((res) => setLikes(res.data.meta.pagination.total))
  }, []);

  const like = async () => {
    const decodedJwt: {id: number, iat: number, exp: number} = jwtDecode(localStorage.getItem("jwt")!);

    if(Object.keys(liked).length === 0) {
      await axios.post(`${props.REACT_APP_BACKEND_URL}/api/likes`, {
        data: {
          liked: true,
          users_permissions_user: decodedJwt.id,
          api: props.api,
          postId: props.postId
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });
    } else {
      await axios.put(`${props.REACT_APP_BACKEND_URL}/api/likes/${liked.id}`, {
        data: {
          liked: !liked.attributes.liked,
          users_permissions_user: decodedJwt.id,
          api: props.api,
          postId: props.postId
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
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
  }

  return (
    <div>
      <p className="font-extrabold">Likes</p>
      <button 
        className={`${Object.keys(liked).length > 0 ? (liked.attributes.liked ? 'text-red-400 hover:text-red-400' : 'text-custom-200') : ""} hover:text-black hover:bg-green-300 text-6xl bg-custom-300 px-1 py-2 rounded-full`} 
        onClick={like}
      >{'<3'}</button>
      <span> {likes}</span>
    </div>
  )
}

export default Likes;