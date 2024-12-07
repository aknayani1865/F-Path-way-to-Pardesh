import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import NavbarAdmin from './NavbarAdmin';
import LoadingSpinner from './LoadingSpinner';

const DestinationTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [destinations, setDestinations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Fetch all destinations
  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setDestinations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setLoading(false);
    }
  };

  // Delete a destination
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this destination?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/places/${id}`, config);
        fetchDestinations(); // Refresh the list after deletion
        toast.success('Destination deleted successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Error deleting place:', error);
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
        setLoading(false);
      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Updating place...');

    try {
      await axios.put(`http://localhost:5000/api/admin/places/${editId}`, editFormData, config);
      setEditId(null); // Exit edit mode
      fetchDestinations(); // Refresh the list
      toast.success('Place updated successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error updating place:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setLoading(false);
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  // Start editing a destination
  const handleEditClick = (destination) => {
    setEditId(destination._id);
    setEditFormData({ name: destination.name || 'Unknown', description: destination.description });
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
          <Button variant="contained" color="primary" onClick={() => navigate('/adddestination')} style={styles.button}>
            Add Place
          </Button>
          <Typography variant="h4" gutterBottom>
            Place Table
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
              <TextField
                label="Description"
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                variant="outlined"
                fullWidth
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
                    <TableCell>Description</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination._id}>
                      <TableCell>{destination.name || 'Unknown'}</TableCell>
                      <TableCell>{destination.description || 'No description'}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditClick(destination)} variant="outlined" color="primary">
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleDelete(destination._id)} variant="outlined" color="error">
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
  submitButton: {
    marginRight: '10px',
  },
  tableContainer: {
    maxWidth: '100%',
    marginTop: '20px',
  },
};

export default DestinationTable;