import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from 'next/image';


const RestaurantArrayListNew = (props) => {
    const [restaurantList, setrestaurantList] = useState(props.restaurantList)
    return (
        <div>
            {
                restaurantList.map((location, index) => {
                    if (index % 2 == 0) {
                        return (
                            <div className="col-lg-6 s-piza addressGrid b-bottom col-sm-12 col-xs-12" key={index}>
                                <div className="col-lg-12">
                                    <div className="col-lg-8">
                                        <h5 className="size_22 color_black weight_300">
                                            <i className="fa fa-cutlery" />{" "}
                                            {location?.restaurantname}
                                        </h5>
                                        {location.website &&
                                            (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                                <i className="fa fa-globe" />{" "}
                                                <span className="size_20 color_grey"> <a href={location.website} target="_blank" rel="noopener noreferrer" style={{ color: 'mediumblue' }}> {location.website} </a></span>
                                            </h5>)}
                                        {location.inquiryemail && (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                            <i className="fa fa-envelope" />{" "}
                                            <span className="size_20 color_grey">{location.inquiryemail}</span>
                                        </h5>)}

                                        {location.inquiryphone && (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                            <i className="fa fa-phone" />{" "}
                                            <span className="size_20 color_grey">{location.inquiryphone}</span>
                                        </h5>)}
                                    </div>
                                    <div className="col-lg-4">
                                        <a target="_blank" href={`/${location.restaurantURL}/`} rel="noopener noreferrer">
                                            {location.logo ? (
                                                <img src={location.logo} alt={location.restaurantname} width={180} height={100} />
                                            ) : ('')}
                                        </a>
                                        <a href={location?.restaurantURL} target="_blank" rel="noopener noreferrer"> <button type="button" className="btn btn-warning btn-lg margin_top_20"> Order Now</button> </a>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                        {location?.locationDetails && location?.locationDetails?.length > 0 &&
                                            (<>
                                                <span className="size_20 color_grey margin_bottom_10" style={{ paddingLeft: '15px' }}> Location: </span>
                                                <br />
                                            </>)
                                        }
                                    </h5>
                                    {location && location?.locationDetails.map((data, newindex) =>
                                    (<>
                                        {/* let restaurantLocationUrl=location?.restaurantURL + location?.locationURL ? "/"+location?.locationURL: +""; */}

                                        {/* <div className="col-lg-6" key={newindex}> */}
                                        <div className={location?.locationDetails.length > 1 ? "col-lg-6" : "col-lg-12 "} key={newindex}>
                                            <div className={location?.locationDetails.length > 1 ? "col-lg-2" : "col-sm-1"}>
                                                <img src="/images/pin.png" alt={data.locationName} />
                                            </div>
                                            <div className="col-lg-10 padding_left_0">
                                                {/* <a href={location?.locationURL ? location?.restaurantURL + "/" + location?.locationURL : location?.restaurantURL} */}
                                                {data.locationURL !== undefined ?
                                                    <a href={location?.restaurantURL + '/' + data?.locationURL}
                                                        target="_blank" rel="noopener noreferrer">
                                                        <span className="size_20 color_grey">{data.locationName}</span>
                                                    </a>
                                                    :
                                                    <a href={location?.restaurantURL}
                                                        target="_blank" rel="noopener noreferrer">
                                                        <span className="size_20 color_grey">{data.locationName}</span>
                                                    </a>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    ))}
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="col-lg-6 s-piza addressGrid b-right b-bottom col-sm-12 col-xs-12" key={index}>
                                <div className="col-lg-12">
                                    <div className="col-lg-8">
                                        <h5 className="size_22 color_black weight_300">
                                            <i className="fa fa-cutlery" />{" "}
                                            {location?.restaurantname}
                                        </h5>
                                        {location.website &&
                                            (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                                <i className="fa fa-globe" />{" "}
                                                <span className="size_20 color_grey"> <a href={location.website} target="_blank" rel="noopener noreferrer" style={{ color: 'mediumblue' }} > {location.website} </a></span>
                                            </h5>)}

                                        {location.inquiryemail &&
                                            (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                                <i className="fa fa-envelope" />{" "}
                                                <span className="size_20 color_grey">{location?.inquiryemail}</span>
                                            </h5>)}

                                        {location.inquiryphone &&
                                            (<h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
                                                <i className="fa fa-phone" />{" "}
                                                <span className="size_20 color_grey">{location.inquiryphone}</span>
                                            </h5>)}
                                    </div>
                                    <div className="col-lg-4">
                                        <a target="_blank" href={"/" + location?.restaurantURL + "/"} rel="noopener noreferrer">
                                            {location.logo ? (
                                                <img src={location.logo} alt={location.restaurantname} width={180} height={100} />) : ('')}
                                        </a>
                                        <a href={location?.restaurantURL} target="_blank" rel="noopener noreferrer"> <button type="button" className="btn btn-warning btn-lg margin_top_20"> Order Now</button> </a>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                        {location?.locationDetails && location?.locationDetails?.length > 0 &&
                                            (<>
                                                <span className="size_20 color_grey margin_bottom_10" style={{ paddingLeft: '15px' }}> Location: </span>
                                                <br />
                                            </>)
                                        }
                                    </h5>
                                    {location && location?.locationDetails.map((data, newindex) =>
                                        <div className={location?.locationDetails.length > 1 ? "col-lg-6" : "col-lg-12 "} key={newindex}>
                                            <div className={location?.locationDetails.length > 1 ? "col-lg-2" : "col-sm-1"}>
                                                <img src="/images/pin.png" alt={data.locationName} />
                                            </div>
                                            <div className="col-lg-10 padding_left_0">
                                                {/* <a href={`${location.locationURL!==undefined ? location?.restaurantURL+'/'+location?.locationURL : location?.restaurantURL}`} */}
                                                {data.locationURL !== undefined ?
                                                    <a href={location?.restaurantURL + '/' + data?.locationURL}
                                                        target="_blank" rel="noopener noreferrer">
                                                        <span className="size_20 color_grey">{data.locationName}</span>
                                                    </a>
                                                    :
                                                    <a href={location?.restaurantURL}
                                                        target="_blank" rel="noopener noreferrer">
                                                        <span className="size_20 color_grey">{data.locationName}</span>
                                                    </a>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default RestaurantArrayListNew