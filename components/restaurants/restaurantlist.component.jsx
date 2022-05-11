import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { RestaurantsServices } from '../../redux/restaurants/restaurants.services';


const RestaurantListComponent = () => {
    const [restaurantList, setRestaurantList] = useState([]);

    useEffect(() => {
        RestaurantsServices.getRestaurantLocationList().then(response => {
            if (response) {
                 
                console.log(response.restaurants);
                setRestaurantList(response.restaurants);
                console.log(restaurantList);
            }
        });
    }, []);


    // const { isLoading, restaurantList, isError, error } = RestaurantsServices.getRestaurantLocationListQuery()
     



    // const { isLoading, restaurantList } =useQuery('super-heroes',fetchSuperHero,{cacheTime:5000}),

    const locationDisplay = (evenItem) => {


        let oddlocations = [];
        let evenlocations = [];

        evenItem.locationDetails.map((location, index) => {
            if (index % 2 == 0) {
                evenlocations.push(location)
            } else {
                oddlocations.push(location)
            }
        });

        return (
            <div className="col-lg-12">
                <h5 className="size_22 color_black weight_300 margin_bottom_20">
                    {evenItem.locationDetails.length > 0 &&
                        (<>
                            <span className="size_20 color_grey margin_bottom_10" style={{ paddingLeft: '15px' }}> Location: </span>
                            <br />
                        </>)
                    }
                </h5>
                {evenlocations.map((location) =>
                (<>
                    <div className="col-lg-6">
                        <div className="col-lg-2">
                            <img src="/images/pin.png" alt />
                        </div>
                        <div className="col-lg-10 padding_left_0">
                            <span className="size_20 color_grey">{location.locationName}</span>
                        </div>
                    </div>
                </>
                ))}

                {oddlocations.map((location) =>
                (
                    <div className="col-lg-6">
                        <div className="col-lg-2">
                            <img src="/images/pin.png" alt />
                        </div>
                        <div className="col-lg-10 padding_left_0">
                            <span className="size_20 color_grey">{location.locationName}</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const restaurantArrayList = [];
    for (let i = 0; i < restaurantList?.length; i += 2) {
        const evenItem = restaurantList[i];
        const oddItem = restaurantList[i + 1];
         
        restaurantArrayList.push(
            <div className="row row-eq-height">
                {oddItem ? (
                    <div className="col-lg-6 s-piza addressGrid b-right b-bottom col-sm-12 col-xs-12">
                        <div className="col-lg-12">
                            <div className="col-lg-8">
                                <h5 className="size_22 color_black weight_300">
                                    {/* <img src="/images/pin.png" alt className="margin_right_10" />{" "} */}
                                    <i className="fa fa-cutlery" />{" "}
                                    {oddItem?.restaurantname}
                                </h5>
                                {oddItem.website &&
                                    (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                        <i className="fa fa-globe" />{" "}
                                        <span className="size_20 color_grey"> <a href={oddItem.website} target="_blank" style={{ color: 'mediumblue' }} > {oddItem.website} </a></span>
                                    </h5>)}

                                {oddItem.inquiryemail &&
                                    (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                        <i className="fa fa-envelope" />{" "}
                                        <span className="size_20 color_grey">{oddItem?.inquiryemail}</span>
                                    </h5>)}

                                {oddItem.inquiryphone &&
                                    (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                        <i className="fa fa-phone" />{" "}
                                        <span className="size_20 color_grey">{oddItem.inquiryphone}</span>
                                    </h5>)}
                            </div>
                            <div className="col-lg-4">
                                <Link href="/[dynamic]/" as={`/${oddItem.restaurantURL}/`}>
                                    <a target="_blank">
                                        {oddItem.logo ? (
                                            // <Image src={oddItem.logo}
                                            //     alt="Picture of the author"
                                            //     width={180}
                                            //     height={100} ></Image>
                                            <img src={oddItem.logo} alt="" width={180} height={100} />) : ('')}
                                    </a>
                                </Link>

                                <a href={oddItem?.restaurantURL} target="_blank"> <button type="button" className="btn btn-warning btn-lg margin_top_20"> Order Now</button> </a>
                            </div>
                        </div>
                        {/* <div className="col-lg-12">    <h5 className="size_22 color_black weight_300 margin_bottom_20">
                            {oddItem.locationDetails.length > 0 &&
                                (<><span className="size_20 color_grey margin_bottom_10" style={{ paddingLeft: '15px' }}> Location: </span>
                                    <br /> </>)
                            }
                        </h5>
                            {oddItem.locationDetails.map((location) =>
                            (<><img src="/images/pin.png" alt className="margin_right_10" style={{ paddingLeft: '15px' }} />
                                <span className="size_20 color_grey">{location.locationName}</span> </>)
                            )}
                        </div> */}

                        {locationDisplay(oddItem)}
                    </div>
                ) : ("")}
                {evenItem ? (
                    <div className="col-lg-6 s-piza addressGrid b-bottom col-sm-12 col-xs-12">
                        <div className="col-lg-12">
                            <div className="col-lg-8">
                                <h5 className="size_22 color_black weight_300">
                                    <i className="fa fa-cutlery" />{" "}
                                    {evenItem?.restaurantname}
                                </h5>
                                {evenItem.website &&
                                    (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                        <i className="fa fa-globe" />{" "}
                                        <span className="size_20 color_grey"> <a href={evenItem.website} target="_blank" style={{ color: 'mediumblue' }}> {evenItem.website} </a></span>
                                    </h5>)}
                                {evenItem.inquiryemail && (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                    <i className="fa fa-envelope" />{" "}
                                    <span className="size_20 color_grey">{evenItem.inquiryemail}</span>
                                </h5>)}

                                {evenItem.inquiryphone && (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                    <i className="fa fa-phone" />{" "}
                                    <span className="size_20 color_grey">{evenItem.inquiryphone}</span>
                                </h5>)}
                            </div>
                            <div className="col-lg-4">
                                <Link href="/[dynamic]/" as={`/${evenItem.restaurantURL}/`}>
                                    <a target="_blank">
                                        {evenItem.logo ? (
                                            // <Image src={evenItem.logo}
                                            //     alt="Picture of the author"
                                            //     width={180}
                                            //     height={100} ></Image>
                                            <img src={evenItem.logo} alt="" width={180} height={100} />
                                        ) : ('')}
                                    </a>
                                </Link>

                                <a href={evenItem?.restaurantURL} target="_blank"> <button type="button" className="btn btn-warning btn-lg margin_top_20"> Order Now</button> </a>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            {locationDisplay(evenItem)}
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                    {restaurantArrayList.length > 0 && restaurantArrayList}
                </div>
            </div>
        </div>
    )
}

export default (RestaurantListComponent)
