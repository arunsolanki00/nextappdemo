import { SessionTypes } from "./session.types"
// import { v4 as uuidv4 } from 'uuid';
export const createSessionId=(guid)=>{
     
      return dispatch=>{
        dispatch({
            type:SessionTypes.CREATE_SESSION_ID,
            payload:guid
        })
      }
}
export const clearSessionId=()=>{
     
    return dispatch=>{
      dispatch({
          type:SessionTypes.CLEAR_SESSION_ID,
          payload:null
      })
    }
}