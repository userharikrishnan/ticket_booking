import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function Register() {
    var [name, setName] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [passwordConf, setPasswordConf] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    var navigate = useNavigate();
    function registerUser(){
        var user = {
            username: name,
            email: email,
            password1: password,
            password2: passwordConf,
          };
        axios.post('http://localhost:8000/register',user).then(response=>{
            setErrorMessage('');
            navigate('/Loginpage');
        }).catch(error=>{
             console.log('Error:', error);
            if(error.response.data.errors){
                setErrorMessage(Object.values(error.response.data.errors).join(' '));
            }else{
                setErrorMessage('Failed to connect to api');
            }
        })
    }
    return <div>
        <Navbar/>
        <div className="container-fluid">
            <div className="row d-flex justify-content-center">
                <div className="col-sm-6 col-md-4" style={{backgroundColor:"rgba(255,255,255,0.8",borderRadius:"13px",marginTop:"90px"}}>
                    <h1 style={{textAlign:"center"}}>Sign Up</h1>
                    {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                    <div className="form-group">
                        <label><b>Name:</b></label><br></br>
                        <input type="text"
                        value={name}
                        onInput={(event)=>setName(event.target.value)}
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
                        <label><b>Email:</b></label><br></br>
                        <input type="text"
                        value={email}
                        onInput={(event)=>setEmail(event.target.value)}
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
                        <label><b>Password:</b></label><br></br>
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
                        <label><b>Confirm Password:</b></label><br></br>
                        <input type="password"
                        value={passwordConf}
                        onInput={(event)=>setPasswordConf(event.target.value)}
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
                        <button className="btn btn-primary mb-2 float-right" onClick={registerUser}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Register;