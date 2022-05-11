import { SessionTypes } from "./session.types"

const SESSSION_INTIAL_STATE={
    sessionid:null
};

const sessionReducer=(state=SESSSION_INTIAL_STATE,action)=>{
     
    switch(action.type){
      case SessionTypes.CREATE_SESSION_ID:
          if(action.payload){
              return {
                  ...state,
                sessionid:action.payload
              }
          }
      case SessionTypes.CLEAR_SESSION_ID:
      
             return{
                 ...state,
                 sessionid:action.payload
             }
        
      default :
      return state;
    }
    
}



export default sessionReducer;