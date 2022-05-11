import Head from 'next/head'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RouteProtection = (component) => {
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    if (userinfo === undefined || userinfo === null)
        return <Link href="/[dynamic]/" as={`/${restaurantinfo.restaurantURL}/`}></Link>;
    else if (userinfo != undefined && userinfo != null)
        return component;
}

export default RouteProtection;

