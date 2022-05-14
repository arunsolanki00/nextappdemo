import '../styles/globals.css'
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store"; 
import Restaurant from '../components/Common/restaurant.component';
import Head from 'next/head';
import ToastNotify from '../components/toastnotify/toast-notify.component';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  
  
  return(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <Head>
        {/* <title>{restaurantinfo.restaurantname}: Online Ordering</title> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Online description" />
      </Head>

      {/* https://medium.com/nextjs/the-script-component-in-next-js-ee6ee6cd705a */}
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js"></Script>
          <Script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" crossOrigin="anonymous" 
           strategy="lazyOnload" 
          />
    <Restaurant>
      

         
   
      <Component {...pageProps} />
      <ToastNotify position={"bottom-right"}/>

   </Restaurant>
   </PersistGate>
  </Provider>
  );
}

export default MyApp
