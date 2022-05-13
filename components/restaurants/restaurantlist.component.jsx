import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { RestaurantsServices } from '../../redux/restaurants/restaurants.services';
import RestaurantArrayListNew from './restaurantarraylist.component';

const RestaurantListComponent = () => {
    const [restaurantList, setRestaurantList] = useState([]);

    useEffect(() => {
        if(restaurantList?.length <= 0){
            RestaurantsServices.getRestaurantLocationList().then(response => {
                if (response) {
                    setRestaurantList(response.restaurants);
                }
            });
        }
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                    {restaurantList.length > 0 ? 
                        <RestaurantArrayListNew restaurantList={restaurantList}> </RestaurantArrayListNew>
                    : <></>}
                    
                </div>
            </div>
        </div>
    )
}

export default RestaurantListComponent
