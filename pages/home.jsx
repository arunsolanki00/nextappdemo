import React from 'react'
import RestaurantListComponent from '../components/restaurants/restaurantlist.component';
const Home =()=> {
    console.log("home component call");
    return (
        <>
            <RestaurantListComponent />
        </>
    )
}

export default Home
