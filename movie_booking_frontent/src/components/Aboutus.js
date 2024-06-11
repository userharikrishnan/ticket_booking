import { Link } from "react-router-dom";
import '../App.css';

function Aboutus() {
    return <div>
        <Link to="/" className="btn btn-info m-2">Go Home</Link>
        <div className="container">
            <div className="Row">
                <div className=" col-10">
                    
                    <p className="aboutptag"><b>
                    Welcome to Showflix, where we bring the magic of cinema to your fingertips with a seamless, user-friendly platform designed for all movie lovers. Discover a vast selection of films, enjoy personalized recommendations, and book tickets effortlessly. Founded by film enthusiasts, our mission is to enhance your movie-going experience with exclusive offers, secure transactions, and 24/7 customer support. We value your feedback and are here to assist you with any questions or concerns. Feel free to contact us via email at <a href="#">support@showflix.com</a>. Thank you for choosing Showflix – let’s make every movie moment magical!
                    </b></p>
                    
                </div>
            </div>
        </div>
    </div>;
}

export default Aboutus;