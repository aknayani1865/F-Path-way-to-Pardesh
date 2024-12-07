import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import NavbarUser from '../components/NavbarUser';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // To arrange cards in a grid layout
import { Loader } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner'

const MyTripsPage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const { user } = useAuthStore(); // Get user from context
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/user/${user._id}/bookings`, config);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <NavbarUser />
     {
      loading ? (
        <div><LoadingSpinner/></div>
      ):(
        <Box sx={{ padding: 4, backgroundColor: '#f7fafc' }}> {/* Container padding and light background */}
        {bookings.length === 0 ? (
          <Typography variant="h6">No trips found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking._id}> {/* Grid responsive layout */}
                <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                  <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {booking.package?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {booking.package?.source?.name || 'Unknown'} • {booking.package?.destination?.name || 'Unknown'}
                    </Typography>
                    <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                      {booking.package?.startDate ? new Date(booking.package.startDate).toLocaleDateString() : 'Unknown'} - {booking.package?.endDate ? new Date(booking.package.endDate).toLocaleDateString() : 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Total Cost: ₹{booking.totalCost || 'Unknown'}
                      <br />
                      Nights: {booking.package?.nights || 'Unknown'}
                      <br />
                      Number of People: {booking.people?.length || 'Unknown'}
                    </Typography>
                  </CardContent>
                  {/* <CardActions>
                    <Button size="small" onClick={() => handleBookingDetails(booking._id)}>View Details</Button>
                  </CardActions> */}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      )
     }
    </>
  );
};

// Placeholder for view details functionality
const handleBookingDetails = (bookingId) => {
  console.log('Viewing details for booking:', bookingId);
};

export default MyTripsPage;