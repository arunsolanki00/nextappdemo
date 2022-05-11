import Head from "next/head";
import Layout from "../../components/Layout";

const SinglePost = ({post}) => {
    return <Layout>
        <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
<ul>
    <h1>
        {post.title}
    </h1>
    <div>
        {post.body}
    </div>
</ul>
    </Layout>;
}

// export async function getServerSideProps(context) {
//    const id= context.params?.id;
//    const res = await fetch ('https://jsonplaceholder.typicode.com/posts/' + id)
//    const post = await res.json();
//    return {
//      props: {post}
//    };
// }

export async function getServerSideProps({ query, req }) {
    
    if(!req){
        return { post: null }
    }
    
    const id= query.id;
    const res = await fetch ('https://jsonplaceholder.typicode.com/posts/' + id)
    const post = await res.json();
    return {
      props: {post}
    };
 }
 
export default SinglePost;

