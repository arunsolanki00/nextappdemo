import React, { useEffect, useState } from "react";
import { TestimonialServices } from "../../redux/testimonial/testimonial.services";

const TestimonialListComponent = (props) => {
  const [testimonialList, setTestimonialList] = useState([]);

  useEffect(() => {
    TestimonialServices.getTestimonialList(props.restaurantId).then((response) => {
      if (response) {
        setTestimonialList(response);
      }
    });
  }, [props.count]);

  return (
    <div className="row">
      <div className="col-lg-12 notification testimonials col-sm-12 col-xs-12">
        <div className="row grid">
          {testimonialList.length > 0 && testimonialList.map((response, index) => (
                <div className="col-lg-6 col-sm-6 col-xs-12 grid-item" key={index}>
                <div className="bd active">
                  <h5>{response.name}</h5>
                  <p>
                    <i className="fa fa-quote-left" aria-hidden="true" />{" "}
                    <span>{response.comment}</span>
                  </p>
                </div>
              </div>
          )
          )};
        </div>
      </div>
    </div>
  );
};

export default TestimonialListComponent;
