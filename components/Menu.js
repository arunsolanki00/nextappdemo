import Link from "next/link"
import MenuCSS from './Menu.module.css'

function Menu() {
    return (
        <>
          <ul className={MenuCSS.menu}><li>
        <Link href="/products/">
          <a>Menu Products</a>
        </Link>
          </li>
          <li>
        <Link 
          href="/products/[category]" 
          as={`/products/some-product-category`}>
          <a> Menu Products Category</a>
        </Link>
         <Link href="/home-ssr">
             <a>
                  Home SSR
             </a>
         </Link>
         <Link href="/">
             <a>
                  Home Static
             </a>
         </Link>
         <Link href="/home-csr">
             <a>
                  Home Client
             </a>
         </Link>
          </li>
          </ul>  
          
        {process.env.NEXT_API_URL}
        {process.env.MYLOCAL_VAR1}
        {process.env.MYLOCAL_VAR2}
        </>
    )
}

export default Menu
