import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveStudentName } from "../../redux/student/student.action";
import { CustomInputButton } from "./button/custominputbutton";
import { useRouter } from "next/router";

const StudentComponent = ({restaurantinfo,selectedCategoryMenuitemName}) => {
    debugger
    const [studentName, setStudentName] = useState('');
    const [error,setError] = useState('');
    const [isDisableSubmit,setIsDisableSubmit] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const { query: { dynamic,location, id, index, category }, } = router;

    const handleStudentNameChange = (name) => {
        setError("");
        setIsDisableSubmit(false);
        setStudentName(name)
    }
    const handleSave = () => {
        debugger
        if(studentName.trim().length <= 0){
            setError("Please enter student name");
            setIsDisableSubmit(true);
            return;
        }
        dispatch(saveStudentName(studentName));
        console.log(studentName)
        $('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        router.push("/" + restaurantinfo.restaurantURL + "/"+ location +"/" + selectedCategoryMenuitemName);
    }

    return (
        <>
            <div id="studentModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    {/* Modal content*/}
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <button type="button" className="close" data-dismiss="modal" >
                                    <img src="/images/close.svg" alt="close" />
                                </button>
                                <h4 style={{ fontSize: "25px" }}>
                                    {/* <i className="fa fa-clock-o" />: */}
                                    Student Details
                                </h4>
                            </div>
                            <form className="customForm">
                                <div className="col-lg-12 col-sm-12 col-xs-12 text-center" style={{ marginTop: "50px", marginBottom: "20px" }}>
                                    <input
                                        type="text"
                                        placeholder="Enter Student First name Last name"
                                        name="studentname"
                                        required
                                        value={studentName}
                                        onChange={(e) => handleStudentNameChange(e.target.value)}
                                    />
                                    <label className="formlabel">Student Name</label>
                                    {error.length > 0 && (
                                         <span className="error">{error}</span>
                                    )}

                                </div>
                                <div className="col-lg-3"></div>
                                <div className="col-lg-6 col-sm-6 col-xs-6">
                                    <CustomInputButton buttonText="Save" buttonType="button" buttonClass="orange_btn_submit" buttonMethod={handleSave} isDisable={isDisableSubmit} disabledClass="orange_submit_disabled color_white" />
                                </div>
                                <div className="col-lg-3"></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentComponent;