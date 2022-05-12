// import logoblue from "../../public/images/logo-blue.png";
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router"

const BackHeaderComponent =() =>{

    const router = useRouter();
    //const dispatch = useDispatch();
    const { query: { dynamic, category },} = router

    return (
        <>
            <div className="col-lg-4 left-a col-sm-12 col-xs-12">
                <Link
                    shallow={false}
                    key={Math.random()} href="/[dynamic]/[category]"
                    as={`/${dynamic}/${category}`}>
                    <a className="size_24 weight_500 color_grey">
                        <span className="bg_grey">
                            <img src="/images/arrow-left.svg" />
                        </span> Back
                    </a>
                </Link>
            </div>
        </>
    )
}

export default BackHeaderComponent;