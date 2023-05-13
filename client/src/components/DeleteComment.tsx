import axios from "axios";

interface Props {
  ASTRO_BACKEND_URL: string;
  commentInfo: any;
  decodedJwt: any;
}

const DeleteComment = (props: Props) => {
  const deleteComment = async () => {
    console.log(props.commentInfo.id)
    const deleteComment = await axios.delete(`${props.ASTRO_BACKEND_URL}/api/comments/${props.commentInfo.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    }).then(() => location.reload())
    .catch((err) => console.log(err))
  }

  return (
    <>
      {props.commentInfo.attributes.userId === props.decodedJwt.id && <button className="text-custom-200 bg-custom-300 h-fit hover:bg-green-300 p-1 mb-1 rounded-md" onClick={deleteComment}>delete</button>}
    </>
  )
}

export default DeleteComment;