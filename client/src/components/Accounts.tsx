import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import PasswordReset from "./PasswordReset";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Loader from "./Loader";

interface Props {
  ASTRO_BACKEND_URL: string;
}

const Accounts = (props: Props) => {
  const [userData, setUserData] = useState<any>();
  const [responseMessage, setResponseMessage] = useState("");
  const [showLikes, setShowLikes] = useState(true);
  const [likes, setLikes] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [likesPage, setLikesPage] = useState(0);
  const [commentsPage, setCommentsPage] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingChangePw, setLoadingChangePw] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingChangeName, setLoadingChangeName] = useState(false)

  const getMe = async () => {
    const me = await axios.get(`${props.ASTRO_BACKEND_URL}/api/users/me`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
    }}).then((res) => {
      const { data } = res;
      setUserData(data);
      setIsSubscribed(data.subscribed)
    }).catch((err) => console.log(err));
  }

  const changePassword = async (e: MouseEvent) => {
    e.preventDefault();
    setLoadingChangePw(true);
    const resetPw = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/forgot-password`, {
      email: userData.email
    }).then(() => {
      setResponseMessage("Password reset email successfully sent.")
      setLoadingChangePw(false);
      setTimeout(() => setResponseMessage(""), 3000)
  })
    .catch((err) => setResponseMessage("An error occured: " + err.response))
  }

  const getLikes = async () => {
    const likes = await axios.get(`${props.ASTRO_BACKEND_URL}/api/likes/me/${likesPage}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    }).then((res) => {
      setLikes((likesOld: any) => [...likesOld, ...res.data]);
      setLoadingLikes(false);
    }).catch((err) => setResponseMessage("There was an error loading your data."));
  }

  const getComments = async () => {
    const comments = await axios.get(`${props.ASTRO_BACKEND_URL}/api/comments/me/${commentsPage}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    }).then((res) => {
      setComments((commentsOld: any) => [...commentsOld, ...res.data]);
      setLoadingComments(false);
    }).catch((err) => {
      setResponseMessage("There was an error loading your data.");
    });
  }

  const subscribe = async (e: ChangeEvent) => {
    setLoadingSub(true);
    console.log(e, (e.target as HTMLInputElement).checked)
    if(isSubscribed) {
      const subscribe = await axios.delete(`${props.ASTRO_BACKEND_URL}/api/subscribeds/${userData.email}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      }).then((res) => {
        setIsSubscribed(!(e.target as HTMLInputElement).checked); 
        setResponseMessage(res.data); 
        setLoadingSub(false);
        setTimeout(() => setResponseMessage(""), 3000)
      })
    } else {
      const subscribe = await axios.post(`${props.ASTRO_BACKEND_URL}/api/subscribeds/`, {
        data: {
          email: userData.email
        }
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      }).then((res) => {
        setIsSubscribed(!(e.target as HTMLInputElement).checked); 
        setResponseMessage(res.data); 
        setLoadingSub(false);
        setTimeout(() => setResponseMessage(""), 3000)
      })
    }
  }

  const changeUsername = async () => {
    const username = (document.getElementById("username") as HTMLInputElement);
    const readOnly = username.readOnly;
    const decodedJwt: any = jwtDecode(sessionStorage.getItem("jwt")!);
    username.readOnly = !readOnly;
    if(readOnly) {
      username.classList.add("bg-white");
    } else {
      setLoadingChangeName(true);
      const changeName = await axios.put(`${props.ASTRO_BACKEND_URL}/api/users/${decodedJwt.id}`, {
        username: username.value
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      });
      username.classList.remove("bg-white");
      setLoadingChangeName(false);
      console.log((document.getElementById("username") as HTMLInputElement).value)
    }
  }

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    getLikes();
  }, [likesPage]);

  useEffect(() => {
    getComments();
  }, [commentsPage]);

  return (
    userData ? 
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 my-2">
        <div>
          <label htmlFor="username">Username: </label>
          <input id="username" name="username" className="bg-custom-100 rounded-md" defaultValue={userData.username} readOnly={true}></input>
          <button className="text-custom-200 bg-custom-300 hover:bg-green-300 px-1 rounded-md"
            onClick={changeUsername}
          >
            Change Username
          </button>
          {loadingChangeName ? <Loader class="inline-block relative" /> : null}
        </div>
        <p>Email: {userData.email}</p>
        <p>Email Confirmed: {userData.confirmed ? "Confirmed" : "Unconfirmed"}</p>
        <span className="block">Subscribed: <input type="checkbox" checked={isSubscribed} onChange={subscribe}></input>{loadingSub ? <Loader class="inline-block absolute m-0" /> : null}</span>
        <div className="grid grid-cols-2">
          <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={changePassword}>{loadingChangePw ? <Loader class="relative m-auto" /> : "Change Password"}</button>
          <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md mx-2" onClick={() => {sessionStorage.removeItem("jwt"); location.replace("/")}}>Logout</button>
        </div>
        {responseMessage && <p className="text-red-500">{responseMessage}</p>}
      </div>
      <div className="md:w-2/3 my-2">
        <button id="likes-button" className={`text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md ${showLikes ? "bg-green-300" : ""}`} onClick={() => {setShowLikes(true); }}>Likes</button>
        <button id="comments-button" className={`text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md ${!showLikes ? "bg-green-300" : ""}`} onClick={() => setShowLikes(false)}>Comments</button>
        {
          showLikes ? 
          !loadingLikes ? <div>
            {likes.length > 0 ? likes.map((like: any, index: number) => {
              return (
                <div key={index}>
                  <p><a href={`/${like.api}/${like.postId}`}>{like.title}</a>
                  <time 
                      dateTime={new Date(like.publishedAt).toISOString()}
                      className="px-3 self-end font-bold"
                    >
                      {
                        new Date(like.publishedAt).toLocaleString('en-us', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    </time>
                  </p>
                </div>
              )
            }) : <p>No Likes to display...</p>}
            {likes.length % 10 === 0 && likes.length !== 0 ? <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={() => setLikesPage(likesPage + 1)}>Load more</button> : null}
          </div> : <Loader class="relative m-1" /> 
          :
          !loadingComments ? <div>
            {comments.length > 0 ? comments.map((comment: any, index: number) => {
              return (
                <div key={index}>
                  <p className="font-bold border-l-2 border-l-black">
                    <a href={`/${comment.api}/${comment.postId}`}>{comment.title}</a>
                    <time 
                      dateTime={new Date(comment.publishedAt).toISOString()}
                      className="px-3 self-end"
                    >
                      {
                        new Date(comment.publishedAt).toLocaleString('en-us', {
                          hour: 'numeric',
                          minute: 'numeric',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    </time>
                  </p>
                  <p className="border-2 border-solid border-black p-2">{comment.comment}</p>
                </div>
              )
            }) : <p>No Comments to display...</p>}
            {comments.length % 10 === 0 && comments.length !== 0 ? <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={() => setCommentsPage(commentsPage + 1)}>Load more</button> : null}
          </div> : <Loader class="relative m-1" /> 
        }
      </div>
    </div>
     : 
    <div>
      Loading user details...
    </div>
  )
}

export default Accounts;