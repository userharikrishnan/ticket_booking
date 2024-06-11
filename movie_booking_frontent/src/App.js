import React from 'react';
import './App.css';
import Navbar from './components/Navbar';


function App() {

  return (
    <div className="App">
      <div className='mt-5'>
        <Navbar />
        
      </div>
      <div className='container'>
        <div className='row'>
          <div className='col-10'>
            <p className='ptag py-3'>
              <h3 style={{WebkitTextStroke: "1px black"}} className='text-danger'><b>Welcome to SHOWFLIX</b></h3>
              <b>Welcome to Showflix, your ultimate destination for seamless movie booking! Discover the latest blockbusters, enjoy personalized recommendations, and book your tickets effortlessly with our user-friendly interface. Stay updated with exclusive offers, connect with fellow movie enthusiasts, and experience the magic of cinema with secure payments and 24/7 customer support. Dive into the world of movies with Showflix and make every showtime a memorable experience!
            </b></p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
