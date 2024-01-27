import { createStore } from "redux";

const initialState={
    userData:null
}

const SET_USER_DATA="SET_USER_DATA"

export const setUSerData=(userdata)=>({
   type:SET_USER_DATA,
   payload:userdata
})

const rootReducer=(state=initialState,action)=>{
    switch(action.type){
        case SET_USER_DATA:return{
            ...state,
            userData:action.payload
        }
        default:return state;
    }
}

const store=createStore(rootReducer)

export default store;