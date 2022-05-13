import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />                  
          <meta name="keywords" content="" />
          <meta name="description" content="Online Restaurant" />
          <meta name="author" content="" />

          {/* <link
            rel="shortcut icon"
            href="images/favicon.ico"
            type="image/x-icon"
          /> */}
          {/* Bootstrap */}
          {/* <link href="/css/bootstrap.min.css" rel="stylesheet" /> */}
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"           
          crossOrigin="anonymous"></link>
          <link href="/css/jquery.bxslider.css" rel="stylesheet" type="text/css" />
          {/* <link href="/css/font-awesome.css" rel="stylesheet" /> */}
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet" />
          <link href="/css/style.css" rel="stylesheet" />
          <link href="/css/fonts.css" rel="stylesheet" />
          <link href="/css/colors.css" rel="stylesheet" />          
          {/* <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/css/style.css" />
          <link rel="stylesheet" href="/css/responsive.css" />
          <link rel="stylesheet" href="/css/custom.css" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* <!-- jQuery (necessary for Bootstrap's JavaScript plugins) --> */}
          {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> */}

          {/* <!-- Include all compiled plugins (below), or include individual files as needed --> */}
          {/* <script src="/js/bootstrap.min.js"></script> */}
   
          {/* <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"           
          crossOrigin="anonymous" ></script> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
