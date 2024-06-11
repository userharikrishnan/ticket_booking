import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";
import showflixlogo from '../showflixlogo.png'; 

function Navbar() {
    var user = useSelector(store=>store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    


    function logout() {
        if (user) {
          try {
            axios.post(
              "http://127.0.0.1:8000/logout",
              {},
              {
                headers: {
                  Authorization: `Token ${user.token}`,
                },
              }
            );
            dispatch(removeUser());
            navigate("/");
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
      }
   
  return <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
        <div className="navbar-brand">
        <img src={showflixlogo} alt="Search Icon" className="search-icon float-left mt-1" style={{ width: '110px', height: '35px',marginRight:'100%' }} />
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
data-target="#navbarNav" aria-controls="navbarNav"aria-expanded="false"
           aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div
        className="collapse navbar-collapse mr-auto" id="navbarNav"  style={{float:"left" }} >
            <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
             <li className="nav-item">
               <NavLink to={"/"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                        Home
                </NavLink>
                </li>

                <li className="nav-item">
               <NavLink to={"/aboutus"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                        About
                </NavLink>
                </li>

                {user && user.username === 'hari' && user.userId === 1 && (
                        <li className="nav-item">
                            <NavLink to={"/createmovie"} className={'nav-link ' + (status => status.isActive ? 'active' : '')}>
                                Add Movie
                            </NavLink>
                        </li>
                    )}

                {user &&(
                <li className="nav-item">
               <NavLink to={"/listmovie"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                        Dashboard
                </NavLink>
                </li>)}
        
                {user &&(
                <li className="nav-item">
               <NavLink to={"/listbookingdetails"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                        My Bookings
                </NavLink>
                </li>)}

                  {!user &&(
                <li className="nav-item">
               <NavLink to={"/register"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                        SignUp
                </NavLink>
                </li>)}

                {user?
                <li className="nav-item">
                <NavLink className="nav-link" onClick={logout}>Logout</NavLink>
                 </li>:
                <li className="nav-item">
                <NavLink 
                to={"/loginpage"} 
                className={
                    'nav-link '+
                    (status => status.isActive ? 'active' : '')
                } 
                >
                    Login
                </NavLink>
                </li>
            }
               
            
            </ul>
       </div>
    </nav>
}

export default Navbar;