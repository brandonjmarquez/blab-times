import { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

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

  useEffect(() => {
    const getComments = async () => {
      //  axios.get(`${props.ASTRO_BACKEND_URL}/api/comments/get-comments/${props.api}/${props.postId}`).then((res) => console.log(res.data));
      return await axios.get(`${props.ASTRO_BACKEND_URL}/api/comments?filters[api][$eq]=${props.api}&filters[postId][$eq]=${props.postId}&pagination[page]=${page}&sort[0]=id%3Adesc&populate=*`);
    };
    

    getComments().then((res) => {setPagination(res.data.meta.pagination); setComments((comments) => [...comments, ...res.data.data])})
    // getComments().then((res) => {setComments((comments) => [...comments, ...res.data])})
  }, [page]);

  const comment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const decodedJwt: {id: number, iat: number, exp: number} = jwtDecode(sessionStorage.getItem("jwt")!);
    // console.log(jwtDecode("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"))
    const createComment = async () => {
      const formData = [...new FormData(e.target as HTMLFormElement)]
        .reduce((a: any, [key, value]: any) => {
          a[key] = value;
          return a;
        }, {});
        console.log(decodedJwt.id, formData)
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
      }).then(() => location.reload());
    }

    const lastMinute = await axios.get(`${props.ASTRO_BACKEND_URL}/api/comments/last-minute/${decodedJwt.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    })
      .then((res) => {
        if(res.data.length === 0) {
          createComment();
        } else {
          setResponseMessage("Please wait at least one minute before commenting again.")
        }
      })
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
      {
        comments.map((commentInfo: any, index: number) => {
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
              <p>{commentInfo.attributes.comment}</p>
            </div>
          )
        })
      }
      {pagination.total / 25 > page && <button className="text-custom-200 bg-custom-300 rounded-md p-2 my-2" onClick={() => setPage(page + 1)}>Load more</button>}
    </div>
  )
}

export default Comments;