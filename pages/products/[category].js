import { useRouter } from "next/router";
import Link from 'next/link';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../../redux/demo/demo.action";

function ProductCategory () {
    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <Layout>
             <Head>
        <title>Create Next App ::{router.query.category}::</title>
        
      </Head>
            <h1>Category {router.query.category} {router.pathname}</h1>
            <Link href="/">
                <a>Home</a>
            </Link>
            <button onClick={() => router.push('/')}>Homepage</button>
            <a className="cart" onClick={() => dispatch(addItem(1))}>
                Add to Cart
              </a>
        </Layout>
    )
}

export default ProductCategory
