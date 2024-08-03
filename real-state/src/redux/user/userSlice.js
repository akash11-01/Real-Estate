import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    loading:false,
    error:null
}
const userSlice = createSlice({
    name:'user',  // isi name se isse kahi bhi use kar sakte using useSelector hook
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true; 
        },
        signInSuccess:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload
        }
    }
})

export const {signInStart,signInSuccess,signInFailure} = userSlice.actions
export default userSlice.reducer