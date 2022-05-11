
import Head from 'next/head'
import Link from "next/link"
import LayoutCSS from "./Layout.module.css" 
import Menu from './Menu'

function Layout ({children}) {
    return (
        <div className={LayoutCSS.container}>           

      <main className={LayoutCSS.main}>
        <ul><li>
        <Link href="/products/">
          <a>Products</a>
        </Link>
          </li>
          <li>
        <Link 
          href="/products/[category]" 
          as={`/products/some-product-category`}>
          <a>Products Category</a>
        </Link>
          </li>
          </ul>
          <br/>
          <Menu/>
          {children}
      </main>  
      
      
    </div>
    )
}

export default Layout
