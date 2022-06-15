 import React from "react";
 import { RegisterComponent } from "../../../components/register/register.component";
 import { MemoizedRegisterHeaderLogoComponent } from "../../../components/Header/registerheaderlogo.component";
 import { useSelector } from "react-redux";
import { useRouter } from "next/router";

 const RegisterPage =()=> {
  const router = useRouter();
  const {
      query: { dynamic,location },
  } = router;
   const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
   return (
     <>
      <section id="pickup">
         <div className="container">
           <div className="row">
             <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                  <a className="size_24 weight_500 color_grey" href={`/${restaurantinfo.restaurantURL}/${location}/ /pickup`}>
                    <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span> Back
                   </a>
             </div>
             <MemoizedRegisterHeaderLogoComponent />
           </div>
           <RegisterComponent />
       </div>
       </section>
     </>
   );
 };

 export default RegisterPage;
