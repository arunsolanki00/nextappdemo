import Head from 'next/head'
import Link from 'next/link';
import { useMemo } from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch, shallowEqual } from "react-redux";

export default function Home({posts}) {

  const democount = useSelector(({ demo }) => demo.demo_count, shallowEqual);

  return (
    <Layout>
         <Head>
        <title>Create Next App :: Static</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1> Welcome to Homepage Nilesh! </h1>
       <h2>TIMESTAMP: {Date.now()}</h2>
       <h1>Count: {democount}</h1>
      <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href="/posts/[id]"  as={`/posts/${post.id}`}>
            <a>
            {post.title}    
            </a>
          </Link>
          
        {post.userId}
        </li>
      ))}
    </ul>
      
    </Layout>
  )
}

export async function getStaticProps(context) {
  
  const res = await fetch ('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json();
  return {
    props: {posts}
  };
}

