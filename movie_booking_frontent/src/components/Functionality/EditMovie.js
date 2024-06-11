import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import checkAuth from "../auth/checkAuth";
import { useSelector } from "react-redux"; 
import { Link } from 'react-router-dom';

function EditMovie() {
    const { postId } = useParams();
    const [post, setPost] = useState({
        Title: '',
        Image_url: '',
        Genere: '',
        Description: '',
        Price: '',
        Trailer: '',
        Show_timeOne: '',
        Show_timeTwo: '',
        Show_timeThree: '',
        Show_dateOne: '',
        Show_dateTwo: '',
        Show_dateThree: ''
    });

    const user = useSelector(state => state.auth.user); 
    const navigate = useNavigate();

    const setTitle = (title) => setPost({ ...post, Title: title });
    const setImage_url = (url) => setPost({ ...post, Image_url: url });
    const setGenere = (genere) => setPost({ ...post, Genere: genere });
    const setDescription = (description) => setPost({ ...post, Description: description });
    const setPrice = (price) => setPost({ ...post, Price: price });
    const setTrailer = (trailer) => setPost({ ...post, Trailer: trailer });
    const setShow_timeOne = (showTimeOne) => setPost({ ...post, Show_timeOne: showTimeOne });
    const setShow_timeTwo = (showTimeTwo) => setPost({ ...post, Show_timeTwo: showTimeTwo });
    const setShow_timeThree = (showTimeThree) => setPost({ ...post, Show_timeThree: showTimeThree });
    const setShow_dateOne = (show_DateOne) => setPost({ ...post, Show_dateOne: show_DateOne });
    const setShow_dateTwo = (show_DateTwo) => setPost({ ...post, Show_dateTwo: show_DateTwo });
    const setShow_dateThree = (show_DateThree) => setPost({ ...post, Show_dateThree: show_DateThree });
    const today = new Date();
    const minDate = new Date(today);
        minDate.setDate(minDate.getDate() + 1);
    const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 4);




    useEffect(() => {
        axios.get(`http://localhost:8000/viewmovie/${postId}/`, {
            headers: {'Authorization': "Token " + user.token}
        }).then(response => {
            setPost(response.data);
        }).catch(error => {
            console.error('Error fetching movie:', error);
        });
    }, [postId]);

    function updatePost() {
        axios.post('http://localhost:8000/editmovie/' + postId, post, {
            headers: { 'Authorization': "Token " + user.token }
        }).then(response => {
            console.log(response.data);
            alert(response.data.message);
            navigate('/listmovie');
        }).catch(error => {
            console.error('Error updating movie:', error);
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
                <div className="row  d-flex justify-content-center">
                    <div className="col-8 my-3" style={{backgroundColor:"rgba(200,200,5, 0.8)",borderRadius:"20px"}}>
                        <h1 className="text-center">Edit Movie</h1>
                        <div className="form-group">
                            <label><b>Title:</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={post.Title}  // Use local state value
                                onChange={(event)=>{setTitle(event.target.value); setPost({...post, Title: event.target.value})}} // Update local state and post state
                            />

                        </div>
                        <div className="form-group">
                            <label><b>Poster link(url):</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={post.Image_url} 
                                onChange={(event)=>{setImage_url(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Genere:</b></label>
                            <input type="text"
                                className="form-control" 
                                value={post.Genere} 
                                onChange={(event)=>{setGenere(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Description:</b></label>
                            <textarea 
                                className="form-control" 
                                value={post.Description} 
                                onChange={(event)=>{setDescription(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Price:</b></label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={post.Price} 
                                onChange={(event)=>{setPrice(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Trailer(url):</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={post.Trailer} 
                                onChange={(event)=>{setTrailer(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label><b>Show Times:</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder='Example: 06:30 PM'
                                value={post.Show_timeOne} 
                                onChange={(event)=>{setShow_timeOne(event.target.value)}}
                            />
                            <input 
                                type="text" 
                                className="form-control my-1" 
                                placeholder='Example: 06:30 PM'
                                value={post.Show_timeTwo} 
                                onChange={(event)=>{setShow_timeTwo(event.target.value)}}
                            />
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder='Example: 06:30 PM'
                                value={post.Show_timeThree} 
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
                                value={post.Show_dateOne}
                                onChange={(event) => setShow_dateOne(event.target.value)}
                            />

                            <input 
                                type="date" 
                                min={minDateString}
                                max={maxDateString}
                                className="form-control"
                                value={post.Show_dateTwo}
                                onChange={(event) => setShow_dateTwo(event.target.value)}
                            />

                            <input 
                                type="date" 
                                min={minDateString}
                                max={maxDateString}
                                className="form-control"
                                value={post.Show_dateThree}
                                onChange={(event) => setShow_dateThree(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary mb-2 float-right" onClick={updatePost}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(EditMovie);
