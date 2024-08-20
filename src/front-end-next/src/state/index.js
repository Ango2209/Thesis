import { createSlice } from "@reduxjs/toolkit";

//Initial state object
const initialState = {
    isSidebarCollapsed: true,
    isDarkMode:false
}

export const globalSlice = createSlice({
    name:"global",
    initialState,
    reducers:{
        setIsSidebarCollapsed:(state, action)=>{
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode:(state,action)=>{
            state.isDarkMode = action.payload
        }
    }
})

export const {setIsSidebarCollapsed,setIsDarkMode}= globalSlice.actions;

export default globalSlice.reducer;