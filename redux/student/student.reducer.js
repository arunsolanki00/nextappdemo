import { StudentTypes } from "./student.types";

const STUDENT_INTIAL_STATE={
    studentname:''
};

const studentReducer=(state=STUDENT_INTIAL_STATE,action)=>{
    switch(action.type){
        case StudentTypes.SAVE_STUDENT_NAME:
            if(action.payload){
                return {
                    ...state,
                  studentname:action.payload
                }
            }
        case StudentTypes.CLEAR_STUDENT_NAME:
               return{
                   ...state,
                   studentname:''
               }
        default :
        return state;
      }
}

export default studentReducer;