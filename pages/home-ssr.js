import Head from 'next/head'
import Layout from '../components/Layout';

export default function Home2({posts}) {
  return (
    <Layout>
         <Head>
        <title>Create Next App :: SSR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1> Welcome to Server Side Homepage Nilesh! </h1>
  <h2>TIMESTAMP: {Date.now()}</h2>
      <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}
        {post.userId}
        </li>
      ))}
    </ul>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch ('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json();
  return {
    props: {posts}
  };
}