import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Loader from './Loader';

interface Props {
  ASTRO_BACKEND_URL: string;
}

const RecentPosts = (props: Props) => {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const sorted = useRef(false);

  useEffect(() => {
    const current = new Date();
    const monthAgo = new Date(new Date().setDate(current.getDate() - 30));

    const fetchPosts = async () => {
      try {
        const recentPosts = await axios.get(`${props.ASTRO_BACKEND_URL}/api/recent-posts`);
        
        return recentPosts.data.data;
      } catch(err) {
        console.error(err);
      }
    }

    const getPosts = async () => {
      try {
        const posts = await fetchPosts();
        let data = posts.map((post: any) => {
          return {...post.attributes};
        })
        setPosts(data);
        setLoading(false);
      } catch(err) {
        console.log(err);
      }
    }
    getPosts()
  }, []);

  useEffect(() => {
    const swap = (array: any, xp: number, yp: number) => {
      var arr = [...array];
      var temp = arr[xp];
      arr[xp] = arr[yp];
      arr[yp] = temp;
      return arr;
    }

    const sortPosts = () => {
      let postsSorted = posts;
      for (var i = 0; i < posts.length - 1; i++) {
        for (var j = 0; j < posts.length-i-1; j++) {
          if (new Date(postsSorted[j].createdAt) < new Date (postsSorted[j + 1].createdAt)) {
            postsSorted = swap(postsSorted, j, j+1);
          }
        }
      }
      sorted.current = !sorted.current;
      return postsSorted.slice(0, 6);
    }
    if(!sorted.current && posts.length > 0) {
      setPosts(sortPosts());
    }
  }, [posts]);

  return (
    <div className="md:absolute md:w-1/5 right-0 mx-6">
      <h4 className="font-bold text-center">Recent Posts</h4>
      <ul>
        {posts.length > 0 ? posts.map((post: any, index: number) => {
          const title = post.title.length < 32 ? post.title : post.title.substring(0, 32) + "..."
          let date = new Date(post.createdAt);
          return (
            <div key={index}>
              <li className="flex justify-center text-center">
                <a href={`/${post.api}/${post.postId}`} className="text-custom-200">
                  <p className="underline">{title}</p>
                  <p>{date.toLocaleDateString()}</p>
                </a>
              </li>
              <hr></hr>
            </div>
          )
        }) : loading ?
          <Loader class="relative m-auto" /> 
          : 
          <p className="text-center">No recent posts found...</p>
        }
      </ul>
    </div>
  )
}

export default RecentPosts;