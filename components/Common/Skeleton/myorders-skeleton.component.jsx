import React from "react";
import Skeleton from "react-loading-skeleton";

export const MyOrdersSkeleton = () => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
          <div className="col-lg-6 col-sm-12 col-xs-12 flush-left">
            <div className="col-lg-12 order col-sm-12 col-xs-12">
              <div className="col-lg-12 flush col-sm-10 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                    <Skeleton width={300} height={30} />
                    <span style={{ marginLeft: "5px",borderRadius:"10px" }}>
                      <Skeleton width={200} height={60} style={{borderRadius:"20px"}}/>
                    </span>
                    <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                      <Skeleton width={150} height={30} />
                    </span>
                  </h3>
                </div>
                <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12" style={{position:"relative"}}>
                <span style={{marginLeft:"800px",position:"absolute",top:"11px",left:"21px"}}>
                    <Skeleton circle={true} height={38} width={38} />
                  </span>
                <hr className="grd margin_bottom_10" />
                {/* <span style={{marginLeft:"800px",position:"absolute",top:"20px",left:"21px"}}>
                    <Skeleton circle={true} height={40} width={40} />
                  </span> */}
               
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-xs-12">
                      <br></br>
                      <h3 className="margin_top_0 margin_bottom_10 weight_500 size_22">
                        <Skeleton height={60} width={800} />
                      </h3>
                      <p className="color_000">
                        {/* <Skeleton height={15} width={200} /> */}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <p className="color_000">
                        <a className="orange_price_btn orderPriceBtn" href="#">
                          {/* <Skeleton height={20} width={100} /> */}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 col-xs-12 flush-left">
            <div className="col-lg-12 order col-sm-12 col-xs-12">
              <div className="col-lg-12 flush col-sm-10 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                    <Skeleton width={300} height={30} />
                    <span style={{ marginLeft: "5px",borderRadius:"10px" }}>
                      <Skeleton width={200} height={60} style={{borderRadius:"20px"}}/>
                    </span>
                    <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                      <Skeleton width={150} height={30} />
                    </span>
                  </h3>
                </div>
                <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12" style={{position:"relative"}}>
                <span style={{marginLeft:"800px",position:"absolute",top:"11px",left:"21px"}}>
                    <Skeleton circle={true} height={38} width={38} />
                  </span>
                <hr className="grd margin_bottom_10" />
                {/* <span style={{marginLeft:"800px",position:"absolute",top:"20px",left:"21px"}}>
                    <Skeleton circle={true} height={40} width={40} />
                  </span> */}
               
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-xs-12">
                      <br></br>
                      <h3 className="margin_top_0 margin_bottom_10 weight_500 size_22">
                        <Skeleton height={60} width={800} />
                      </h3>
                      <p className="color_000">
                        {/* <Skeleton height={15} width={200} /> */}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <p className="color_000">
                        <a className="orange_price_btn orderPriceBtn" href="#">
                          {/* <Skeleton height={20} width={100} /> */}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ****************************************************************** */}
          </div>
          <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
          <div className="col-lg-6 col-sm-12 col-xs-12 flush-left">
            <div className="col-lg-12 order col-sm-12 col-xs-12">
              <div className="col-lg-12 flush col-sm-10 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                    <Skeleton width={300} height={30} />
                    <span style={{ marginLeft: "5px",borderRadius:"10px" }}>
                      <Skeleton width={200} height={60} style={{borderRadius:"20px"}}/>
                    </span>
                    <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                      <Skeleton width={150} height={30} />
                    </span>
                  </h3>
                </div>
                <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12" style={{position:"relative"}}>
                <span style={{marginLeft:"800px",position:"absolute",top:"11px",left:"21px"}}>
                    <Skeleton circle={true} height={38} width={38} />
                  </span>
                <hr className="grd margin_bottom_10" />
                {/* <span style={{marginLeft:"800px",position:"absolute",top:"20px",left:"21px"}}>
                    <Skeleton circle={true} height={40} width={40} />
                  </span> */}
               
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-xs-12">
                      <br></br>
                      <h3 className="margin_top_0 margin_bottom_10 weight_500 size_22">
                        <Skeleton height={60} width={800} />
                      </h3>
                      <p className="color_000">
                        {/* <Skeleton height={15} width={200} /> */}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <p className="color_000">
                        <a className="orange_price_btn orderPriceBtn" href="#">
                          {/* <Skeleton height={20} width={100} /> */}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 col-xs-12 flush-left">
            <div className="col-lg-12 order col-sm-12 col-xs-12">
              <div className="col-lg-12 flush col-sm-10 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                    <Skeleton width={300} height={30} />
                    <span style={{ marginLeft: "5px",borderRadius:"10px" }}>
                      <Skeleton width={200} height={60} style={{borderRadius:"20px"}}/>
                    </span>
                    <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                      <Skeleton width={150} height={30} />
                    </span>
                  </h3>
                </div>
                <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12" style={{position:"relative"}}>
                <span style={{marginLeft:"800px",position:"absolute",top:"11px",left:"21px"}}>
                    <Skeleton circle={true} height={38} width={38} />
                  </span>
                <hr className="grd margin_bottom_10" />
                {/* <span style={{marginLeft:"800px",position:"absolute",top:"20px",left:"21px"}}>
                    <Skeleton circle={true} height={40} width={40} />
                  </span> */}
               
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-xs-12">
                      <br></br>
                      <h3 className="margin_top_0 margin_bottom_10 weight_500 size_22">
                        <Skeleton height={60} width={800} />
                      </h3>
                      <p className="color_000">
                        {/* <Skeleton height={15} width={200} /> */}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <p className="color_000">
                        <a className="orange_price_btn orderPriceBtn" href="#">
                          {/* <Skeleton height={20} width={100} /> */}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ****************************************************************** */}
          </div>
          <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
          <div className="col-lg-6 col-sm-12 col-xs-12 flush-left">
            <div className="col-lg-12 order col-sm-12 col-xs-12">
              <div className="col-lg-12 flush col-sm-10 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                    <Skeleton width={300} height={30} />
                    <span style={{ marginLeft: "5px",borderRadius:"10px" }}>
                      <Skeleton width={200} height={60} style={{borderRadius:"20px"}}/>
                    </span>
                    <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                      <Skeleton width={150} height={30} />
                    </span>
                  </h3>
                </div>
                <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12" style={{position:"relative"}}>
                <span style={{marginLeft:"800px",position:"absolute",top:"11px",left:"21px"}}>
                    <Skeleton circle={true} height={38} width={38} />
                  </span>
                <hr className="grd margin_bottom_10" />
                {/* <span style={{marginLeft:"800px",position:"absolute",top:"20px",left:"21px"}}>
                    <Skeleton circle={true} height={40} width={40} />
                  </span> */}
               
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-xs-12">
                      <br></br>
                      <h3 className="margin_top_0 margin_bottom_10 weight_500 size_22">
                        <Skeleton height={60} width={800} />
                      </h3>
                      <p className="color_000">
                        {/* <Skeleton height={15} width={200} /> */}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <p className="color_000">
                        <a className="orange_price_btn orderPriceBtn" href="#">
                          {/* <Skeleton height={20} width={100} /> */}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 col-xs-12 flush-left">
            <div className="col-lg-12 order col-sm-12 col-xs-12">
              <div className="col-lg-12 flush col-sm-10 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h3 className="color_000 margin_top_0 margin_bottom_10 weight_500">
                    <Skeleton width={300} height={30} />
                    <span style={{ marginLeft: "5px",borderRadius:"10px" }}>
                      <Skeleton width={200} height={60} style={{borderRadius:"20px"}}/>
                    </span>
                    <span className="orange_btn padding_left_20 padding_right_20 w_auto edit_btn edit pickupBtn">
                      <Skeleton width={150} height={30} />
                    </span>
                  </h3>
                </div>
                <div className="col-lg-12 margin_top_10 col-sm-12 col-xs-12" style={{position:"relative"}}>
                <span style={{marginLeft:"800px",position:"absolute",top:"11px",left:"21px"}}>
                    <Skeleton circle={true} height={38} width={38} />
                  </span>
                <hr className="grd margin_bottom_10" />
                {/* <span style={{marginLeft:"800px",position:"absolute",top:"20px",left:"21px"}}>
                    <Skeleton circle={true} height={40} width={40} />
                  </span> */}
               
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-xs-12">
                      <br></br>
                      <h3 className="margin_top_0 margin_bottom_10 weight_500 size_22">
                        <Skeleton height={60} width={800} />
                      </h3>
                      <p className="color_000">
                        {/* <Skeleton height={15} width={200} /> */}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-xs-12">
                      <p className="color_000">
                        <a className="orange_price_btn orderPriceBtn" href="#">
                          {/* <Skeleton height={20} width={100} /> */}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ****************************************************************** */}
          </div>
      </div>
    </div>
  );
};
