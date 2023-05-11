import { MouseEvent, useEffect, useState } from "react";
import PasswordReset from "./PasswordReset";
import axios from "axios";
import jwtDecode from "jwt-decode";

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

  const getMe = async () => {
    try {
      const me = await axios.get(`${props.ASTRO_BACKEND_URL}/api/users/me`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
      }});
      const { data } = me;
      setUserData(data)
    } catch(err) {
      console.log(err)
    }
  }

  const changePassword = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const resetPw = await axios.post(`${props.ASTRO_BACKEND_URL}/api/auth/forgot-password`, {
        email: userData.email
      })
      setResponseMessage("Password reset email successfully sent.");
    } catch(err: any) {
      console.log("An error occured: ", err.response)
    }
  }

  const getLikes = async () => {
    try {
      const decodedJwt: any = jwtDecode(sessionStorage.getItem("jwt")!);
      const likes = await axios.get(`${props.ASTRO_BACKEND_URL}/api/likes/me/${decodedJwt.id}/${likesPage}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      });
      setLikes((likesOld: any) => [...likesOld, ...likes.data]);
    } catch(err) {
      setResponseMessage("There was an error loading your data.")
    }
  }

  const getComments = async () => {
    try {
      const decodedJwt: any = jwtDecode(sessionStorage.getItem("jwt")!);
      const comments = await axios.get(`${props.ASTRO_BACKEND_URL}/api/comments/me/${decodedJwt.id}/${commentsPage}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      });
      setComments((commentsOld: any) => [...commentsOld, ...comments.data]);
      console.log(comments.data)
    } catch(err) {
      setResponseMessage("There was an error loading your data.")
    }
  }

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    getLikes();
  }, [likesPage]);

  useEffect(() => {
    console.log(commentsPage);
    getComments();
  }, [commentsPage]);

  return (
    userData ? 
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 my-2">
        <p>Username: {userData.username}</p>
        <p>Email: {userData.email}</p>
        <p>Email Confirmed: {userData.confirmed ? "Confirmed" : "Unconfirmed"}</p>
        <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={changePassword}>Reset Password</button>
        <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md mx-2" onClick={() => {sessionStorage.removeItem("jwt"); location.replace("/")}}>Logout</button>
        {responseMessage && <p className="text-red-500">{responseMessage}</p>}
      </div>
      <div className="md:w-2/3 my-2">
        <button id="likes-button" className={`text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md ${showLikes ? "bg-green-300" : ""}`} onClick={() => {setShowLikes(true); }}>Likes</button>
        <button id="comments-button" className={`text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md ${!showLikes ? "bg-green-300" : ""}`} onClick={() => setShowLikes(false)}>Comments</button>
        {
          showLikes ? 
          <div>
            {likes.map((like: any, index: number) => {
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
            })}
            {likes.length % 10 === 0 ? <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={() => setLikesPage(likesPage + 1)}>Load more</button> : null}
          </div>
          :
          <div>
            {comments.map((comment: any, index: number) => {
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
            })}
            {comments.length % 10 === 0 && comments.length !== 0 ? <button className="text-custom-200 bg-custom-300 hover:bg-green-300 p-2 rounded-md" onClick={() => setCommentsPage(commentsPage + 1)}>Load more</button> : null}
          </div>
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