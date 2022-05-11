import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const IndexSkeleton = () => {
  return (
    <div>
      <section id="pickup" className="checkout">
        <div className="container">
          <div className="row">
          <div className="col-lg-12 text-center col-sm-12 col-xs-12">
            <Skeleton height={90} width={240}/>
            </div>
            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <h1 className="margin_bottom_30">
                  <Skeleton height={40} width={500} />
                </h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 flush col-sm-12 col-xs-12">
              <div className="col-lg-10 column-centered col-sm-12 col-xs-12">
                <div className="row row-eq-height">
                  <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                    <div className="">
                      <Skeleton circle={true} height={45} width={45} />
                    </div>
                    <div >
                      <Skeleton height={360} width={5} />
                    </div>
                  </div>
                  <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                        <h3>
                          <Skeleton height={20} width={250} />
                        </h3>
                      </div>
                    </div>
                    <div className="row in">
                      <div className="col-lg-12 flush col-sm-12 col-xs-12">
                        <div className="col-lg-8 col-sm-8 col-xs-12">
                          <h5 className="size_22 color_black weight_300 margin_bottom_20">
                            <Skeleton height={15} width={200} />
                            <br />
                            <span className="size_20 color_grey">
                              <Skeleton height={20} width={200} />
                            </span>
                          </h5>
                          <h5 className="size_22 color_black weight_300 margin_bottom_20">
                            <Skeleton height={20} width={200} />
                          </h5>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-xs-12">
                        <h5 className="size_22 color_black weight_300 margin_bottom_20">
                          <Skeleton height={50} width={200} />
                        </h5>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-xs-12">
                        <h5 className="size_22 color_black weight_300 margin_bottom_20">
                          <Skeleton height={50} width={200} />
                          <br />
                          <span className="size_20 color_grey"></span>
                        </h5>
                      </div>
                      <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                        <Skeleton
                          height={50}
                          width={110}
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <>
                  <div className="row row-eq-height">
                    <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                      <div className="">
                        <Skeleton circle={true} height={45} width={45} />
                      </div>
                    </div>
                    <div className="col-lg-11 sp-d col-sm-11 col-xs-12" style={{heigth:"291px"}}>
                      <div className="row">
                        <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                          <h3>
                            <Skeleton height={20} width={200} />
                          </h3>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-8 column-centered flush margin_top_10 col-sm-10 col-xs-12">
                          <>
                            <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                              <Skeleton
                                height={60}
                                width={182}
                                style={{ borderRadius: "20px" }}
                              />
                            </div>
                            <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                              <Skeleton
                                height={60}
                                width={182}
                                style={{ borderRadius: "20px" }}
                              />
                            </div>
                            <div className="col-lg-4 text-center col-sm-4 col-xs-12"></div>
                            <div className="col-lg-12 dd text-center col-sm-12 col-xs-12"></div>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row row-eq-height">
                    <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                      <div className="row">
                        <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                        <div className="col-lg-12  btns text-center col-sm-12 col-xs-12">
                          <Skeleton
                            height={150}
                            width={150}
                            style={{
                              borderRadius: "20px",
                              marginRight: "30px",
                            }}
                          />
                          <Skeleton
                            height={150}
                            width={150}
                            style={{ borderRadius: "20px" }}
                          />
                        </div>

                        <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                          <Skeleton
                            height={58}
                            width={320}
                            style={{ borderRadius: "20px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
