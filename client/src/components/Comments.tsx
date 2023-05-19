import { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import DeleteComment from './DeleteComment';
import Loader from './Loader';

interface Props {
  api: string;
  postId: number;
  ASTRO_BACKEND_URL: string;
}

const Comments = (props: Props) => {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<{username: string, comment: string}[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComments = async () => {
      return await axios.get(`${props.ASTRO_BACKEND_URL}/api/comments?filters[api][$eq]=${props.api}&filters[postId][$eq]=${props.postId}&pagination[page]=${page}&sort[0]=id%3Adesc&populate=*`);
    };
    
    getComments().then((res) => {
      setLoading(false);
      setPagination(res.data.meta.pagination); 
      setComments((comments) => [...comments, ...res.data.data])
    });
  }, [page]);

  const comment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      if(sessionStorage.getItem("jwt")) {
        const decodedJwt: {id: number, iat: number, exp: number} = jwtDecode(sessionStorage.getItem("jwt")!);
        const createComment = async () => {
          const formData = [...new FormData(e.target as HTMLFormElement)]
            .reduce((a: any, [key, value]: any) => {
              a[key] = value;
              return a;
            }, {});
          const createCommentRes = await axios.post(`${props.ASTRO_BACKEND_URL}/api/comments`, {
            data: {
              ...formData,
              userId: decodedJwt.id,
              api: props.api,
              postId: props.postId.toString()
            }
          }, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            }
          })
          location.reload();
        } 

        const lastMinute = await axios.get(`${props.ASTRO_BACKEND_URL}/api/comments/last-minute/${decodedJwt.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
          }
        })
          
        if(lastMinute.data.length === 0) {
          const formData = [...new FormData(e.target as HTMLFormElement)]
          .reduce((a: any, [key, value]: any) => {
            a[key] = value;
            return a;
          }, {});
          const createCommentRes = await axios.post(`${props.ASTRO_BACKEND_URL}/api/comments`, {
            data: {
              ...formData,
              userId: decodedJwt.id,
              api: props.api,
              postId: props.postId.toString()
            }
          }, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            }
          })
          location.reload();
        } else {
          setResponseMessage("Please wait at least one minute before commenting again.")
        }
      }
    } catch(err: any) {
      setResponseMessage(err.response.data.error.message)
    }
  }

  return (
    <div>
      <p className="font-extrabold">Comments</p>
      <form onSubmit={comment}>
        <textarea id="comment" name="comment" style={{resize: "none"}} rows={3} placeholder="Leave a comment here..." className="p-2" required>

        </textarea>
        {responseMessage && <p className="text-red-500">{responseMessage}</p>}
        <button type="submit" className="text-custom-200 bg-custom-300 rounded-md p-2 mb-2">Submit</button>
      </form>
      { loading ? <Loader class="relative m-auto" /> :
        comments.map((commentInfo: any, index: number) => {
          let decodedJwt: {id: number, iat: number, exp: number} | null = null;
          if(sessionStorage.getItem("jwt")) {
            decodedJwt = jwtDecode(sessionStorage.getItem("jwt") ?? "")
          }
          return (
            <div key={index} className="border-2 px-2">
              <p className="flex font-bold justify-between">
                {commentInfo.attributes.username}
                <time 
                  dateTime={new Date(commentInfo.attributes.publishedAt).toISOString()}
                  className="px-3 self-end"
                >
                  {
                    new Date(commentInfo.attributes.publishedAt).toLocaleString('en-us', {
                      hour: 'numeric',
                      minute: 'numeric',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                </time>
              </p>
              <p className="flex justify-between">
                <span className="whitespace-break-spaces">{commentInfo.attributes.comment}</span>
                {decodedJwt ? <DeleteComment ASTRO_BACKEND_URL={props.ASTRO_BACKEND_URL} commentInfo={commentInfo} decodedJwt={decodedJwt}/> : null}
              </p>
            </div>
          )
        })
      }
      {pagination.total / 25 > page && <button className="text-custom-200 bg-custom-300 rounded-md p-2 my-2" onClick={() => setPage(page + 1)}>Load more</button>}
    </div>
  )
}

export default Comments;