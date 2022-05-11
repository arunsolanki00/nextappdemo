import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";
// import 'react-loading-skeleton/dist/skeleton.css'
export const DeliverySkeleton = () => {
  return (
    <>
      <section id="pickup" className="checkout">
        <div className="container">
          <div className="row">
          <div className="col-lg-12 text-center col-sm-12 col-xs-12">
            <Skeleton height={90} width={240}/>
            </div>
            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                {/* <h1 className="margin_bottom_30">
                  <Skeleton height={50} width={400} />
                </h1> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
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
            <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
              <div className="col-lg-11 column-centered col-sm-12 col-xs-12">
                <div className="row row-eq-height">
                  <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                    <div ><Skeleton circle={true} height={45} width={45} /></div>
                    <div ><Skeleton height={330} width={5} /></div>
                  </div>
                  <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                        <h3>
                          <Skeleton height={20} width={350} />
                        </h3>
                      </div>
                    </div>
                    <div className="row in">
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <div className="col-lg-4 flush">
                          <h4 className="size_24 color_orange weight_500 margin_top_10 margin_bottom_15">
                            <Skeleton height={20} width={300} />
                          </h4>
                        </div>

                        <div className="col-lg-4">
                          <h4 className="size_24 color_orange weight_500 margin_top_10 margin_bottom_15">
                            <Skeleton height={20} width={300} />
                          </h4>
                        </div>

                        <div className="col-lg-4">
                          <h4 className="size_24 color_orange weight_500 margin_top_10 margin_bottom_15">
                            &nbsp;
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="row in">
                      <div className="col-lg-4 col-sm-4 col-xs-12">
                        <div>
                          <div className="col-lg-12 col-sm-12 col-xs-12  padding_10 margin_top_15 border_radius_20 minHeightAddBox ">
                            <Skeleton
                              height={130}
                              width={300}
                              style={{ borderRadius: "20px" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-xs-12">
                        <div>
                          <div className="col-lg-12 col-sm-12 col-xs-12  padding_10 margin_top_15 border_radius_20 minHeightAddBox ">
                          <Skeleton
                              height={130}
                              width={300}
                              style={{ borderRadius: "20px" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                      <Skeleton
                              height={70}
                              width={180}
                              style={{ borderRadius: "20px" }}
                            />
                      </div>
                    </div>

                    <div className="row in">
                      <div className="row in margin_top_30">
                        <div className="col-lg-4 col-sm-4 col-xs-12">
                        <Skeleton height={50} width={200} />
                        </div>

                        <div className="col-lg-4 col-sm-4 col-xs-12">
                        <Skeleton height={50} width={200} />
                        </div>
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                        <Skeleton
                              height={60}
                              width={140}
                              style={{ borderRadius: "20px" }}
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row row-eq-height">
                  <div className="col-lg-1 text-center small-text-left flush col-sm-1 col-xs-12">
                   <div ><Skeleton circle={true} height={45} width={45} /></div>
                  </div>
                  <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <h3> <Skeleton height={20} width={350} /></h3>
                      </div>
                    </div>
                    <div className="row margin_top_20">
                      <div className="col-lg-10 column-centered flush col-sm-10 col-xs-12">
                        <div className="col-lg-2"></div>

                        <>
                          <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <Skeleton
                              height={60}
                              width={170}
                              style={{ borderRadius: "20px" }}
                            />
                          </div>

                          <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <Skeleton
                              height={60}
                              width={170}
                              style={{ borderRadius: "20px" }}
                            />
                          </div>
                        </>

                        <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                          <div className="col-lg-2"></div>

                          <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <Skeleton
                              height={60}
                              width={170}
                              style={{ borderRadius: "20px" }}
                            />
                          </div>

                          <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <Skeleton
                              height={60}
                              width={170}
                              style={{ borderRadius: "20px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
