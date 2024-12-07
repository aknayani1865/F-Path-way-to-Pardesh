import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
import { Button, TextField, MenuItem, Typography, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AddHotelForm = () => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [message, setMessage] = useState('');
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        };
        const response = await axios.get('http://localhost:5000/api/admin/places', config);
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        };
        const response = await axios.get('http://localhost:5000/api/admin/hotels', config);
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchDestinations();
    fetchHotels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating hotel...');

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      };
      await axios.post('http://localhost:5000/api/admin/hotels', {
        name,
        destination,
        pricePerNight,
      }, config);
      setMessage('Hotel added successfully!');
      setName('');
      setDestination('');
      setPricePerNight('');
      toast.success('Hotel created successfully!');
      // Optionally refetch hotels to update the list
      const response = await axios.get('http://localhost:5000/api/admin/hotels', config);
      setHotels(response.data);
    } catch (error) {
      setMessage('Failed to add hotel');
      console.error(error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div style={{ padding: '20px' }}>
        <Button variant="contained" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
          Back
        </Button>
        <Typography variant="h4" gutterBottom>
          Add Hotel
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Place</InputLabel>
              <Select
                label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>Select a place</em>
                </MenuItem>
                {destinations.map((dest) => (
                  <MenuItem key={dest._id} value={dest._id}>
                    {dest.name || 'Unknown'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Price Per Night"
              variant="outlined"
              fullWidth
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="contained" color="primary">
            Add Hotel
          </Button>
        </form>
        <Typography variant="h6" gutterBottom>
          Hotels List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Place</TableCell>
                <TableCell>Price Per Night</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell>{hotel.name || 'Unknown'}</TableCell>
                  <TableCell>{hotel.place?.name || 'Unknown'}</TableCell>
                  <TableCell>₹{hotel.pricePerNight || 'Unknown'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default AddHotelForm;