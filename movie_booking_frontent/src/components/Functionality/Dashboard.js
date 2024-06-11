import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux"; 
import './Dashboard.css';

function ListMovies() {
    const [allPosts, setAllPosts] = useState([]); 
    const [filteredPosts, setFilteredPosts] = useState([]); 
    const [SearchTerm, setSearchTerm] = useState("");
    const [Title, setTitle] = useState("");
    const [showModal, setShowModal] = useState(false); 
    const [selectedMovieId, setSelectedMovieId] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const user = useSelector(state => state.auth.user);
    const [linkStates, setLinkStates] = useState(() => {
        const saved = localStorage.getItem('linkStates');
        return saved ? JSON.parse(saved) : filteredPosts.map(() => false);
    });

    useEffect(() => {
        localStorage.setItem('linkStates', JSON.stringify(linkStates));
    }, [linkStates]);

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    
    const refreshButtonClick = () => {
        setSearchTerm("");
      };


    const handleSearch = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (SearchTerm.trim() === "") {
            filterPostsByDate(selectedDate);
        } else {
            const filteredItems = filteredPosts.filter((item) =>
                item.Title.toLowerCase().startsWith(SearchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) {
                alert("no match found")
                setSearchTerm("");
            } else {
                setFilteredPosts(filteredItems);
                

            }
            
        }
    };

    // Select box mechanism

    const today = new Date();
    const date1 = new Date(today);
    date1.setDate(date1.getDate());
    const date2 = new Date(today);
    date2.setDate(date2.getDate() + 1);
    const date3 = new Date(today);
    date3.setDate(date3.getDate() + 2);
    const date4 = new Date(today);
    date4.setDate(date4.getDate() + 3);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState(formatDate(date1));

    const handleSelectChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate); 
        console.log(selectedDate);
        filterPostsByDate(selectedDate);
    };

    function fetchPosts() {
        if (!user || !user.token) {
            console.error('User or token is undefined');
            return;
        }

        axios.get('http://localhost:8000/listmovie', {
            headers: { 'Authorization': "Bearer " + user.token }
        })
            .then((response) => {
                console.log(response.data);
                setAllPosts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    useEffect(() => {
        if (user && user.token) {
            fetchPosts();
        }
    }, [user]);

    useEffect(() => {
        if (allPosts.length > 0) {
            filterPostsByDate(selectedDate);
        }
    }, [allPosts, selectedDate]);

    const filterPostsByDate = (date) => {
        if (date == "All Movies") {
            const filteredItems = allPosts
            setFilteredPosts(filteredItems);
        }else{
        const filteredItems = allPosts.filter((item) => {
            return (
                item.Show_dateOne === date ||
                item.Show_dateTwo === date ||
                item.Show_dateThree === date
            );
        });

        setFilteredPosts(filteredItems);
    }
    };


    // Delete function

    const handleDelete = (movieId, title) => {
        console.log("handledelete is called")
        setSelectedMovieId(movieId);
        setShowModal(true);
        setTitle(title);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:8000/delete/${selectedMovieId}/`, {
            headers: {
                Authorization: `Token ${user.token}`,
            },
        })
            .then((response) => {
                fetchPosts();
                setShowModal(false);
            })
            .catch((error) => {
                console.error("Error deleting Movie:", error);
            });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Checkbox function

    const handleCheckboxChange = (movieid) => (event) => {
        const newLinkStates = [...linkStates];
        newLinkStates[movieid] = event.target.checked;
        setLinkStates(newLinkStates);
    };

    if (loading) {
        return <div>
            <h3 style={{ color: "red", WebkitTextStroke: "1px white" }}>Loading...</h3>;
        </div>
    }

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 d-flex">
                     
                        <div className="input-group  mr-5" style={{ width: "350px"}}>
                            <input type="text" className="form-control " placeholder="Search Movie" value={SearchTerm} onChange={handleSearchInputChange} />
                            <div className="input-group-append">
                                <button className="btn btn-secondary rounded" onClick={refreshButtonClick}><i className="fa">&#xf021;</i></button>
                                <button className="btn btn-primary" onClick={handleSearch}><i className="fas fa-search"></i></button>
                            </div>
                        </div>

                        <div class=" ml-auto ">
                            <select
                                className="btn btn-outline-light btn-small bg-secondary"
                                id="dateInput"
                                style={{ textAlign: "center" }}
                                onChange={handleSelectChange}
                            >
                                <option value={formatDate(date1)}>Today</option>
                                <option>{formatDate(date2)}</option>
                                <option>{formatDate(date3)}</option>
                                <option>{formatDate(date4)}</option>
                                {user && user.username === 'hari' && user.userId === 1 && (
                                <>
                                <hr></hr>
                                <option>All Movies</option>
                                </>
                                )}
                            </select>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center my-4 now-running-text">Now Running</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-wrap">
                            {filteredPosts.map((movie) => (
                                <div key={movie.id} className="card bg-warning m-2">

                                    {linkStates[movie.id] ? (<span>
                                        <img className="card-img-top" src={movie.Image_url} style={{ maxWidth: '240px', maxHeight: '210px' }} alt="movie poster" />
                                        <div className="card-title m-1"><h5>{movie.Title}</h5></div>
                                        <div className="card-body"><p>{movie.Genere}</p></div>
                                        <div><p id="movietext" className="text-danger d-flex justify-content-center">
                                            {user.userId !== 1 ? "Movie Not Available" : "Movie Disabled"} </p></div>
                                    </span>) : (
                                        <Link to={`/viewmovies/${movie.id}?date=${selectedDate}`} style={{ textDecoration: "none", color: "black" }} className={movie.disabled ? 'disabled-link' : ''}>
                                            <img className="card-img-top" src={movie.Image_url} style={{ maxWidth: '240px', maxHeight: '210px' }} alt="movie poster" />
                                            <div className="card-title m-1"><h5>{movie.Title}</h5></div>
                                            <div className="card-body"><p>{movie.Genere}</p></div>
                                        </Link>)}

                                    {user && user.username === 'hari' && user.userId === 1 && (
                                        <div className="card-footer bg-warning" style={{ backgroundColor: "#ffffff" }}>
                                            <Link to={`/listmovie/${movie.id}/edit`} className="btn btn-primary float-right">Edit</Link>
                                            <button className="btn btn-primary float-left" onClick={() => handleDelete(movie.id, movie.Title)}>Delete</button>
                                            <div style={{ clear: 'both' }}></div>
                                            <div className="m-2 py-1 px-3 border border-primary rounded" style={{backgroundColor:"rgba(255,0,0,0.25)"}}>
                                                <label className="d-flex justify-content-center align-items-center outline mt-1">Disable Movie
                                                    <input
                                                        type="checkbox"
                                                        checked={linkStates[movie.id]}
                                                        onChange={handleCheckboxChange(movie.id)}
                                                        className="m-2" />
                                                </label>
                                            </div>
                                        </div>)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <>
                {/* Modal for delete confirmation */}
                {showModal && (

                    <div className="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
                        <div className="modal-content" style={{ width: '350px', height: '200px', textAlign: 'center', position: 'relative' }}>
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete this movie?</p>
                            <p>[ {Title} ]</p>
                            <div className="modal-buttons">
                                <button className="btn btn-secondary" style={{ position: 'absolute', bottom: '10px', right: '10px' }} onClick={closeModal}>Cancel</button>
                                <button className="btn btn-danger" style={{ position: 'absolute', bottom: '10px', left: '10px' }} onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>

                )}
            </>
        </div>
    );
}

export default ListMovies;
