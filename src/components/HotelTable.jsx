import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, InputLabel, FormControl } from '@mui/material';
import NavbarAdmin from './NavbarAdmin';
import LoadingSpinner from './LoadingSpinner';

const HotelTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]); // Store all destinations
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', destination: '', pricePerNight: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
    fetchDestinations(); // Fetch destinations for the dropdown
  }, []);

  // Fetch all hotels with populated destination name
  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', config); // Adjust your API route as necessary
      setHotels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setLoading(false);
    }
  };

  // Fetch all destinations for the dropdown
  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setDestinations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setLoading(false);
    }
  };

  // Delete a hotel with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this hotel?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/hotels/${id}`, config);
        fetchHotels(); // Refresh the list after deletion
        toast.success('Hotel deleted successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
        setLoading(false);
      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Editing Hotel...');

    try {
      await axios.put(`http://localhost:5000/api/admin/hotels/${editId}`, editFormData, config);
      setEditId(null); // Exit edit mode
      fetchHotels(); // Refresh the list
      toast.success('Hotel updated successfully!');
      setLoading(false);
      } catch (error) {
      console.error('Error updating hotel:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setLoading(false);
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  // Start editing a hotel
  const handleEditClick = (hotel) => {
    setEditId(hotel._id);
    setEditFormData({
      name: hotel.name || 'Unknown',
      destination: hotel.place?._id || '', // Set destination id for the dropdown
      pricePerNight: hotel.pricePerNight || 'Unknown',
    });
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <NavbarAdmin />
      {
        loading ? (
          <div><LoadingSpinner/></div>
        ):(
          <div style={styles.container}>
        <Button variant="contained" color="primary" onClick={() => navigate('/addhotel')} style={styles.button}>
          Add Hotel
        </Button>
        <Typography variant="h4" gutterBottom>
          Hotel Table
        </Typography>
        {editId ? (
          <form onSubmit={handleEditFormSubmit} style={styles.form}>
            <TextField
              label="Name"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              required
              variant="outlined"
              fullWidth
              style={styles.textField}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Place *</InputLabel>
              <Select
                label="Place"
                name="destination"
                value={editFormData.destination}
                onChange={handleEditFormChange}
                required
                variant="outlined"
                fullWidth
                style={styles.select}
              >
                <MenuItem value="">Select Place</MenuItem>
                {destinations.map((destination) => (
                  <MenuItem key={destination._id} value={destination._id}>
                    {destination.name || 'Unknown'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price per Night"
              name="pricePerNight"
              value={editFormData.pricePerNight}
              onChange={handleEditFormChange}
              required
              variant="outlined"
              fullWidth
              type="number"
              style={styles.textField}
            />
            <Button type="submit" variant="contained" color="primary" style={styles.submitButton}>
              Save
            </Button>
            <Button onClick={() => setEditId(null)} variant="outlined" color="secondary">
              Cancel
            </Button>
          </form>
        ) : (
          <TableContainer component={Paper} style={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Place</TableCell>
                  <TableCell>Price per Night</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel._id}>
                    <TableCell>{hotel.name || 'Unknown'}</TableCell>
                    <TableCell>{hotel.place?.name || 'Unknown'}</TableCell>
                    <TableCell>{hotel.pricePerNight || 'Unknown'}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditClick(hotel)} variant="outlined" color="primary">
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(hotel._id)} variant="outlined" color="error">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
        )
      }
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  button: {
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px',
  },
  textField: {
    marginBottom: '10px',
  },
  select: {
    marginBottom: '10px',
  },
  submitButton: {
    marginRight: '10px',
  },
  tableContainer: {
    maxWidth: '100%',
    marginTop: '20px',
  },
};

export default HotelTable;