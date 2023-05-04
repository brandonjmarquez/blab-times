import React, { useEffect, useRef, useState } from 'react';

interface Props {
  REACT_APP_BACKEND_URL: string;
}

const RecentPosts = (props: Props) => {
  const [posts, setPosts] = useState<any>([]);
  const sorted = useRef(false);

  useEffect(() => {
    const current = new Date();
    const monthAgo = new Date(new Date().setDate(current.getDate() - 30));

    const fetchPosts = async () => {
      const bookReports = await fetch(`${props.REACT_APP_BACKEND_URL}/api/book-reports?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const poetry = await fetch(`${props.REACT_APP_BACKEND_URL}/api/poetries?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const storytime = await fetch(`${props.REACT_APP_BACKEND_URL}/api/storytimes?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const therapyTalks = await fetch(`${props.REACT_APP_BACKEND_URL}/api/therapy-talks?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const fetches = [bookReports, poetry, storytime, therapyTalks];
      
      // await Promise.all(fetches);
      const posts = await Promise.all(fetches.map(r => r.json()));
      return posts;
    }

    const getPosts = async () => {
      await fetchPosts().then((datas) => {
        setPosts(() => {
          let data: any = []
          datas.forEach((post: any) => {
            data = [...data, ...post.data]
          })
          return data;
        })
      });
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
          if (new Date(postsSorted[j].attributes.publishedAt) < new Date (postsSorted[j + 1].attributes.publishedAt)) {
            postsSorted = swap(postsSorted, j, j+1);
          }
        }
      }
      sorted.current = !sorted.current;
      return postsSorted;
    }
    if(!sorted.current && posts.length > 0) {
      setPosts(sortPosts());
    }
  }, [posts]);

  return (
    <div className="w-2/6">
      <h4>Recent Posts</h4>
      <ul>
        {posts.map((post: any, index: number) => {
          let date = new Date(post.attributes.publishedAt);
          return <li key={index}><a href={`/${post.attributes.api}/${post.id}`} className="text-custom-200">{post.attributes.title} {date.toLocaleDateString()}</a></li>
        })}
      </ul>
    </div>
  )
}

export default RecentPosts;