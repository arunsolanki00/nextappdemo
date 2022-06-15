import React from 'react'
import Image from "next/image";
import closeImage from "../../public/images/close.svg"
const CalenderTimeComponent = () => {
  return (
    <div
      id="myModal-timer"
      className="modal choose-time fade"
      role="dialog"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
              <button type="button" className="close" data-dismiss="modal">
                <Image src={closeImage} alt="" />
              </button>
              <h3>Choose time</h3>
            </div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
              <div className id="datetimepicker4" />
            </div>
            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
              <a className="blue_btn nextbtn" href="#">
                Save
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalenderTimeComponent
