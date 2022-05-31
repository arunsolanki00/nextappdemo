import React from 'react'
import RestaurantListComponent from '../components/restaurants/restaurantlist.component';
const Home = () => {
    console.log("Hello!");
    console.log("use the local .env", process.env.NEXT_PUBLIC_ENV_LOCAL)
    // console.log("home component call");
    return (
        <>
            <RestaurantListComponent />
        </>
    )
}

export default Home
