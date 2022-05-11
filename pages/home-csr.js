import Head from 'next/head'
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Home3() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () =>{
      //const res = await fetch(`${process.env.NEXT_API_URL}/posts`);
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
      const posts = await res.json();
      setPosts(posts);
    };
    fetchPosts();
  }, [])

  
  return (
    <Layout>
         <Head>
        <title>Create Next App :: CSR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1> Welcome to Client Side Render Homepage Nilesh! </h1>
  <h2>TIMESTAMP: {Date.now()}</h2>
      <ul>
      {!posts ? (
        <p>Loading...</p>
      ):(
        <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}
        {post.userId}
        </li>
      ))}
      </ul>
      )}
    </ul>
    </Layout>
  )
}

