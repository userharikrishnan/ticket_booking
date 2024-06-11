import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import checkAuth from "../auth/checkAuth";
import { Link } from 'react-router-dom';

function CreateMovies() {
    const [Title, setTitle] = useState('');
    const [Image_url, setImage_url] = useState('');
    const [Genere, setGenere] = useState('');
    const [Description, setDescription] = useState('');
    const [Price, setPrice] = useState('');
    const [Trailer, setTrailer] = useState('');
    const [Show_timeOne, setShow_timeOne] = useState('');
    const [Show_timeTwo, setShow_timeTwo] = useState('');
    const [Show_timeThree, setShow_timeThree] = useState('');
    const [Show_dateOne, setShow_dateOne] = useState('');
    const [Show_dateTwo, setShow_dateTwo] = useState('');
    const [Show_dateThree, setShow_dateThree] = useState('');
    const today = new Date();
    const minDate = new Date(today);
        minDate.setDate(minDate.getDate() + 1);
    const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 4);

    const user = useSelector(state => state.auth.user); 

    var navigate = useNavigate()
    function addmovie() {
        if (!user || !user.token) {
            console.error('User or token is undefined');
            return;
        }

        axios.post('http://localhost:8000/createmovie', {
            Title:Title,
            Image_url: Image_url,
            Genere: Genere,
            Description: Description,
            Price:Price,
            Trailer:Trailer,
            Show_timeOne:Show_timeOne,
            Show_timeTwo:Show_timeTwo,
            Show_timeThree:Show_timeThree,
            Show_dateOne: Show_dateOne,
            Show_dateTwo: Show_dateTwo,
            Show_dateThree: Show_dateThree
        }, { 
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'X-CSRFToken': user.csrfToken  // Include CSRF token in the request headers
            }
        }).then(response => {
            if (response.data && response.data.message) {
                alert(response.data.message);
              } else {
                alert("Movie added successfully!");
              }
            navigate('/listmovie')
        }).catch(error => {
            console.error('Error adding movie:', error);
            let errorMessage = 'An error occurred while adding the movie.';
        
            if (error.response) {
                
                if (error.response.data && error.response.data.message) {
                    errorMessage = `Error: ${error.response.data.message}`;
                } else {
                    errorMessage = `Error: ${error.response.status} ${error.response.statusText} , please fill out all the fields appropriatley`;
                }
            } else {
                errorMessage = `Error: ${error.message}`;
            }
        
            alert(errorMessage);
        });
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
      const minDateString = formatDate(minDate);
      const maxDateString = formatDate(maxDate);

    return (
        <div>
            <div className="container-fluid">
            <Link to="/listmovie" className="btn btn-info btn-sm m-2">Go to Dashboard</Link>
                <div className="row mx-5 my-2 d-flex justify-content-center">
                    <div style={{backgroundColor:"rgba(200,200,5, 0.8)",borderRadius:"20px"}} className="col-12">
                        <h1 className="text-center">Add Movie</h1>
                        <div className="form-group">
                            <label><b>Title:</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={Title} 
                                onChange={(event)=>{setTitle(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Poster link (url):</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={Image_url} 
                                onChange={(event)=>{setImage_url(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Genere:</b></label>
                            <input type="text"
                                className="form-control" 
                                value={Genere} 
                                onChange={(event)=>{setGenere(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Description:</b></label>
                            <textarea 
                                className="form-control" 
                                value={Description} 
                                onChange={(event)=>{setDescription(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Price:</b></label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={Price} 
                                onChange={(event)=>{setPrice(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Trailer(url):</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={Trailer} 
                                onChange={(event)=>{setTrailer(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Show Times:</b></label>
                            <input 
                                type="text" 
                                className="form-control m-1"
                                placeholder="Example: 06:30 PM"
                                value={Show_timeOne} 
                                onChange={(event)=>{setShow_timeOne(event.target.value)}}
                            />
                            <input 
                                type="text" 
                                className="form-control m-1"
                                placeholder="Example: 06:30 PM"
                                value={Show_timeTwo} 
                                onChange={(event)=>{setShow_timeTwo(event.target.value)}}
                            />
                            <input 
                                type="text" 
                                className="form-control m-1"
                                placeholder="Example: 06:30 PM"
                                value={Show_timeThree} 
                                onChange={(event)=>{setShow_timeThree(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Show Dates:</b></label><br></br>
                            <input 
                                type="date" 
                                min={minDateString}
                                max={maxDateString}
                                className="form-control"
                                value={Show_dateOne}
                                onChange={(event) => setShow_dateOne(event.target.value)}
                            />

                            <input 
                                type="date"
                                min={minDateString}
                                max={maxDateString} 
                                className="form-control"
                                value={Show_dateTwo}
                                onChange={(event) => setShow_dateTwo(event.target.value)}
                            />

                            <input 
                                type="date" 
                                min={minDateString}
                                max={maxDateString}
                                className="form-control"
                                value={Show_dateThree}
                                onChange={(event) => setShow_dateThree(event.target.value)}
                            />
                        </div>

                        <div className="form-group ">
                            <button className="btn btn-primary float-right mb-3" onClick={addmovie}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(CreateMovies);
