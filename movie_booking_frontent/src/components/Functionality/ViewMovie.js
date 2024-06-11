import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import checkAuth from "../auth/checkAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function ViewMovie() {
    const { postId } = useParams();

    const location = useLocation();
    const selectedDate = new URLSearchParams(location.search).get("date");

    const [post, setPost] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [noTickets, setNoTickets] = useState(1);
    const [sumTotal, setSumTotal] = useState(post.Price)
    const user = useSelector(state => state.auth.user);
    const [paymentLoading, setPaymentLoading] = useState(false);  
    var navigate = useNavigate()
    
    
    useEffect(() => {
        console.log(selectedDate)
        
        if (!user || !user.token || !postId) {
            console.error('User, token, or postId is undefined');
            return;
        }
    
        axios.get(`http://localhost:8000/viewmovie/${postId}/`, {
            headers: {'Authorization': "Token " + user.token}
        }).then(response => {
           
            setPost(response.data);
        }).catch(error => {
            console.error('Error fetching movie:', error);
           
        });
    }, [postId, user.token]);

    const openModelBox = () => {
        
          setShowModal(true); // Open the modal when delete button is clicked
          
    };

      const closeModal = () => {
        setShowModal(false); // Close the modal
        };

    const handleNumTicketsChange = (event) => {
        const newNumTickets = parseInt(event.target.value);
        if(newNumTickets <= 0){
            alert('please provide a positive value')
        }else{
        setNoTickets(newNumTickets);}
    };
    useEffect(() => {
        
        setSumTotal(noTickets * post.Price);
    }, [post, noTickets]);


    const handlePayment = () => {
        
        

         //RAZORPAY

         setPaymentLoading(true); // Set loading state while payment is being processed
    
         axios.post('http://localhost:8000/initiate-payment/', {
             amount: sumTotal * 100, // Razorpay expects amount in paisa
             currency: 'INR', // Change to appropriate currency code
             orderId: postId, // Use a unique order ID
             description: `Booking for ${post.Title}`,
         }).then(response => {
             const { data } = response;
     
             const options = {
                 key: 'rzp_test_B5RfVeU9FgSHpO', // Replace with your Razorpay key
                 amount: data.amount,
                 currency: data.currency,
                 order_id: data.id,
                 name: 'Show Flix',
                 description: 'Movie Booking',
                 handler: function(response) {
                     // Handle payment success
                     console.log(response);

                    if (response.razorpay_order_id) {
                        registerBooking(response.razorpay_order_id)
                    }
                 },
                 prefill: {
                     name: 'Customer Name',
                     email: 'customer@example.com',
                     contact: '1234567890'
                 },
                 theme: {
                     color: '#3399cc'
                 }
             };
     
             const razorpay = new window.Razorpay(options);
             razorpay.open();
         }).catch(error => {
             console.error('Error initiating payment:', error);
             // Handle error
         }).finally(() => {
             setPaymentLoading(false); // Reset loading state
         });


         //booking handling

        const registerBooking = (razorpayId) => {
        const showDateInput = document.getElementById("showDateInput");
        const bookingId = Math.random().toString(36).substr(2, 8);
        const bookingData = {
            booking_id:bookingId,
            user: user.userId,
            movie: postId,
            booking_date: new Date().toISOString().split('T')[0],
            booking_time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            quantity: noTickets,
            show_date: showDateInput.value,
            moviename: post.Title,
            total_price: sumTotal,
            booked_date: selectedDate
        };
    
        axios.post('http://localhost:8000/create-booking/', bookingData)
            .then(response => {
                const bookingId = response.data.booking_id; 
                setShowModal(false); 
                generateEmail(bookingId,razorpayId)
                console.log('Booking successful:', response.data);
                console.log('Booking ID:', bookingId);
                
            })
            .catch(error => {
                console.error('Error creating booking:', error);
                
            });

        } 
        };
        

        const generateEmail = (bookingId,razorpayId) => {

            console.log("Data sent to backend:", {
                movieName: post.Title,
                totalPrice: sumTotal,
                noOfSeats: noTickets,
                paymentID: razorpayId,
                receiptId: bookingId,
                email: user.userEmail,
                bookingDate: new Date().toISOString().split('T')[0],
                showTime: document.getElementById("showDateInput").value,
              });

              axios.post('http://localhost:8000/generate-qr-code/', {
                "movieName": post.Title,
                "totalPrice": sumTotal,
                "noOfSeats": noTickets,
                "paymentID": razorpayId,
                "receiptId": bookingId,
                "bookingDate": new Date().toISOString().split('T')[0],
                "showTime": document.getElementById("showDateInput").value,
                "email": user.userEmail
              })
              .then(response => {
                alert(response.data.message);
                navigate("/listmovie")
              })
              .catch(error => {
                console.error('Error generating email:', error);
                
              });       
        };
        
        const getEmbedUrl = (url) => {
            const videoId = url.split('v=')[1] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        };
        
    
    
    return (
        <div className="container-fluid">
             <Link to="/listmovie" className="btn btn-info btn-sm m-2">Go to Dashboard</Link>
            <div className="row mr-3">

                <div className="col-md-4 col-sm-5 card m-3">
                    <img className="my-3" src={post.Image_url} style={{ maxWidth: '100%', maxHeight: '250px' }} />
                
                   <span><h3>{post.Title}</h3></span>
                    <p className="card-text">{post.Genere}</p>
                    <p className="card-text">{post.Description}</p>
                    <p className="card-text text-danger">{post.Price} per ticket</p>
                
                    <button className="btn btn-primary mb-2" onClick={() => openModelBox()}>Book Tickets</button>
                </div>
                {post.Trailer && (
                <div className="col-md-7 col-sm-5 my-3">
                    <iframe
                          title="YouTube Trailer"
                          width="400px"
                          height="250px"
                          src={getEmbedUrl(post.Trailer)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen>
                    </iframe>
                </div>
                )}
            </div>


                <>
            {/* Modal for delete confirmation */}
            {showModal && (
                <div className="modal" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}>
                    <div className="modal-content" style={{width:'350px', height:'290px', textAlign: 'center', position: 'relative'}}>
                        <h4>Book Tickets</h4>
                            <label>How many tickets?</label>
                            <input type="number" value={noTickets} onChange={handleNumTicketsChange}  style={{textAlign:"center"}}/>
                             <label>Sum Total</label>
                            <input type="number" value={sumTotal} style={{textAlign:"center"}} disabled/>
                            <label>provide time slot</label>
                            <select id="showDateInput" style={{textAlign: "center"}}>
                                <option>{post.Show_timeOne}</option>
                                <option>{post.Show_timeTwo}</option>
                                <option>{post.Show_timeThree}</option>
                            </select>

                        
                        <div className="modal-buttons">
                            <button className="btn btn-secondary" style={{position:"absolute",bottom:'10px',right:'10px'}} onClick={closeModal}>Cancel</button>
                            <button className="btn btn-primary" style={{position:"absolute",bottom:'10px',left:'10px'}} onClick={handlePayment} disabled={paymentLoading}>
                                    {paymentLoading ? 'Processing Payment...' : 'Proceed to Payment'}
                            </button>

                        </div>
                    </div>
                </div>
            )}
            </>


        </div>
    );
}

export default checkAuth(ViewMovie);
