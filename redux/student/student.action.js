import { StudentTypes } from "./student.types"
// import { v4 as uuidv4 } from 'uuid';
export const saveStudentName=(name)=>{
    return dispatch=>{
        dispatch({
            type:StudentTypes.SAVE_STUDENT_NAME,
            payload:name
        });
      }
}

export const clearStudentName=(name)=>{
    return dispatch=>{
        dispatch({
            type:StudentTypes.CLEAR_STUDENT_NAME,
            payload:name
        });
      }
}