import React, { useEffect, useState } from 'react';

const RecentPosts = () => {
  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    const current = new Date();
    const monthAgo = new Date(new Date().setDate(current.getDate() - 30));

    const fetchPosts = async () => {
      const bookReports = await fetch(`http://127.0.0.1:1338/api/book-reports?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const poetry = await fetch(`http://127.0.0.1:1338/api/poetries?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const storytime = await fetch(`http://127.0.0.1:1338/api/storytimes?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const therapyTalks = await fetch(`http://127.0.0.1:1338/api/therapy-talks?filters[publishedAt][$gte]=${monthAgo.toJSON()}`);
      const fetches = [bookReports, poetry, storytime, therapyTalks];
      
      await Promise.all(fetches)
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
    const swap = (arr: any, xp: number, yp: number) => {
      var temp = arr[xp];
      arr[xp] = arr[yp];
      arr[yp] = temp;
    }

    const sortPosts = () => {
      let postsSorted = posts;
      let datesSorted = [];
      for (var i = 0; i < posts.length - 1; i++) {
        for (var j = 0; j < posts.length-i-1; j++) {
          if (new Date(posts[j].attributes.publishedAt) < new Date (posts[j+1].attributes.publishedAt)) {
            swap(postsSorted, j, j+1);
          }
        }
      }
      const reverse = postsSorted.reverse()
      return reverse;
    }
    if(posts.length > 0) setPosts(sortPosts())
    console.log(posts)
  }, [posts]);

  return (
    <div className="w-full">
      <h4>Recent Posts</h4>
      <ul>
        {posts.map((post: any, index: number) => {
          let date = new Date(post.attributes.createdAt);
          return <li key={index}><a href={`/${post.attributes.api}/${post.id}`} className="text-custom-200">{post.attributes.title} {date.toLocaleDateString()}</a></li>
        })}
      </ul>
    </div>
  )
}

export default RecentPosts;