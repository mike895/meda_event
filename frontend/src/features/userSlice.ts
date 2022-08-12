import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parse, serialize } from "cookie";
import Cookies from 'js-cookie'
import { getCurrentUser } from '../helpers/httpCalls';

export const getCurrentUserThunk = createAsyncThunk(
    'user/getCurrent',
    async () => {
        if (!Cookies.get("jwt_auth")) {
            throw "Not logged in";
        }
        const res = await getCurrentUser();
        if(res.error) throw "Case expired token";
        return res;
    }
)
export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: true
    },
    reducers: {
        login: (state, action) => {
            Cookies.set("jwt_auth", action.payload.token, {
                path: "/",
                expires: new Date(action.payload.expiryDate)
            })
            state.user = action.payload
            state.loading = false;
        },
        logout: (state) => {
            Cookies.remove('jwt_auth', { path: '/' });
            state.user = null;
            state.loading = false;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getCurrentUserThunk.rejected, (state) => {
            Cookies.remove('jwt_auth', { path: '/' });
            state.user = null;
            state.loading = false;

        })
        builder.addCase(getCurrentUserThunk.fulfilled, (state, action) => {
            console.log(action);
            state.user = action.payload.result
            state.loading = false;
        })
        builder.addCase(getCurrentUserThunk.pending, (state) => {
            state.loading = true;
        })
    },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: any) => { return { user: state.user.user, loading: state.user.loading } };
export default userSlice.reducer;