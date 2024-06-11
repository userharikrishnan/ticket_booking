import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/auth/register";
import Login from "./components/auth/Login";
import Aboutus from "./components/Aboutus";
import CreateMovie from "./components/Functionality/CreateMovie";
import Dashboard from "./components/Functionality/Dashboard";
import ViewMovie from "./components/Functionality/ViewMovie";
import EditMovie from "./components/Functionality/EditMovie";
import BookingListByUser from "./components/Functionality/listBookingDetails";


const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: 'register', element:<Register/>},
    { path: 'Loginpage', element:<Login/>},
    { path: 'aboutus', element:<Aboutus/>},
    { path: 'createmovie', element:<CreateMovie/>},
    { path: 'viewmovies/:postId', element:<ViewMovie/>},
    { path: '/listmovie/:postId/edit', element: <EditMovie/>},
    { path: 'listmovie', element:<Dashboard/>},
    { path: 'listbookingdetails', element:<BookingListByUser/>},
    
]);

export default router;