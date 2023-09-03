import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    books: null,
    issues: null
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload
        },
        setBooks: (state, action) => {
            state.books = action.payload
        },
        logoutUser: (state) => {
            state.books = null
            state.user = null
            state.issues=null
        },
        setIssues: (state, action) => {
            state.issues = action.payload
        },
        issue_book:(state,action)=>{
            state.issues.push(action.payload)
        },
        return_book:(state,action)=>{
            state.issues[action.payload.idx]=action.payload.data
            
        }
    }
})
export const { loginUser, logoutUser, setBooks ,setIssues,issue_book,return_book} = userSlice.actions;
export default userSlice.reducer;