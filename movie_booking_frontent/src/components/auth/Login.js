import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import Navbar from "../Navbar";
import {useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const useremail= useState("");
    var [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate=useNavigate()
    function attemptLogin() {
        axios.post('http://localhost:8000/login',{
            username: username,
            email: useremail,
            password:password
        }).then(response=>{
            console.log(response.data);
            const user = {
                username: username,
                userEmail: response.data.email,
                userId: response.data.id,
                token: response.data.token,
                userType: response.data.user_type,
              };
            dispatch(setUser(user));
            
            navigate('/listmovie')
        }).catch(error=>{
            if(error.response.data.errors){
                alert(Object.values(error.response.data.errors).join(''))
            }else if(error.response.data.message){
                alert(error.response.data.message)
            }else{
                alert('Failed to login user. Please contact admin')
            }
        })
    }
    return (<div>
        <Navbar/>
        <div className="container-fluid">
            <div className="row d-flex justify-content-center" >
                <div className="col-sm-6 col-md-4"
                    style={{backgroundColor:"rgba(255,255,255,0.8",borderRadius:"13px",marginTop:"170px"}}>
                    <h1 style={{textAlign:"center"}}>Login</h1>
                    <div className="form-group">
                        <label><b>Username:</b></label>
                        <input type="text"
                        value={username}
                        onInput={(event)=>setUsername(event.target.value)}
                        style={{border:"1px solid black",
                            borderTop:"none",
                            borderLeft:"none",
                            borderRight:"none",
                            width:"100%",
                            height:"30px",
                            background:"transparent",
                            outline:"none"
                        }}
                        />
                    </div>
                   
                    <div className="form-group">
                    <label><b>Password:</b></label>
                        <input type="password"
                        value={password}
                        onInput={(event)=>setPassword(event.target.value)}
                        style={{border:"1px solid black",
                            borderTop:"none",
                            borderLeft:"none",
                            borderRight:"none",
                            width:"100%",
                            height:"30px",
                            background:"transparent",
                            outline:"none"
                        }}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary float-right mb-2" onClick={attemptLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default Login;