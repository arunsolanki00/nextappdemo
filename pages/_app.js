import '../styles/globals.css'
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store"; 
import Restaurant from '../components/Common/restaurant.component';
import Head from 'next/head';
import ToastNotify from '../components/toastnotify/toast-notify.component';

function MyApp({ Component, pageProps }) {
  
  
  return(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <Restaurant>
      <Head>
        {/* <title>{restaurantinfo.restaurantname}: Online Ordering</title> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Online description" />
      </Head>
      <Component {...pageProps} />
      <ToastNotify position={"bottom-right"}/>
   </Restaurant>
   </PersistGate>
  </Provider>
  );
}

export default MyApp
