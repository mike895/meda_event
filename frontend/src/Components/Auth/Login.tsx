import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from '../../features/userSlice';
import { loginUser } from '../../helpers/httpCalls';
const Login = () => {
    const dispatch = useDispatch();
    const {user,loading} = useSelector(selectUser)
    const _loginUser = async ({username,password}:{username:string,password:string}) =>{
        let res  = await loginUser({
            username,
            password
        })
        if(!res.error){
            dispatch(login({
                ...res,
                loggedIn:true
              }
              ));
        }
        else{
            console.log("Login failed")
        }
    }
    return (
        <div>

                    {
        loading? <h1>Loading</h1>:
          user?<button onClick={()=>{
            dispatch(logout());
          }}>Logout</button>:
        <button onClick={()=>{
            _loginUser({username:"SUPERUSER",password:"123456"})
        }}>
          Login Here
        </button>
        }
        </div>
    )
}

export default Login
 