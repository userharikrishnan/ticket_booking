import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function BookingListByUser() {
    const user = useSelector(state => state.auth.user);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.userId) {
            fetchBookingsByUser(user.userId);
        }
    }, [user]);

    const fetchBookingsByUser = (userId) => {
        axios.get(`http://localhost:8000/list-bookings/${userId}/`)
            .then(response => {
                console.log(response.data)
                setBookings(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching bookings by user:', error);
                setLoading(false);
            });
    };

    const downloadPDF = (bookingId) => {
        axios({
            url: `http://localhost:8000/booking-pdf/${bookingId}/`,
            method: 'GET',
            responseType: 'blob', 
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `booking_${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(error => {
            console.error('Error downloading PDF:', error);
        });
    };

    if (loading) {
        return <div>
            <h3  style={{color:"red",WebkitTextStroke: "1px white"}}>Loading...</h3>
            </div>;
    }

    return (
        <div>
            <Link to="/listmovie" className="btn btn-info btn-sm m-2">Go to Dashboard</Link>
            <table className="table table-striped table-bordered bg-white ">
                <thead className='thead-dark'>
                    <tr>
                        <th>Booking ID</th>
                        <th>Movie</th>
                        <th>Booking Date</th>
                        <th>Booking Time</th>
                        <th>Quantity</th>
                        <th>Show Date</th>
                        <th>Show Time</th>
                        <th>Total Price</th>
                        <th>QR Link</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.booking_id}>
                            <td>{booking.booking_id}</td>
                            <td>{booking.moviename}</td>
                            <td>{booking.booking_date}</td>
                            <td>{booking.booking_time}</td>
                            <td>{booking.quantity}</td>
                            <td>{booking.booked_date}</td>
                            <td>{booking.show_date}</td>
                            <td>{booking.total_price}</td>
                            <td>
                                <button 
                                    className='btn btn-primary btn-sm'
                                    onClick={() => downloadPDF(booking.booking_id)}
                                >
                                    Download pdf
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookingListByUser;
