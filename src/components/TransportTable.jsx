import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import NavbarAdmin from './NavbarAdmin';
import LoadingSpinner from './LoadingSpinner';

const TransportTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [transports, setTransports] = useState([]);
  const [sources, setSources] = useState([]); // List of available sources
  const [destinations, setDestinations] = useState([]); // List of available destinations
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ type: '', from: '', to: '', price: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransports();
    fetchSources();
    fetchDestinations();
  }, []);

  // Fetch all transports with populated from and to fields
  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transports', config);
      setTransports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transports:', error);
      setLoading(false);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  // Fetch all sources for dropdown
  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setSources(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sources:', error);
      setLoading(false);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  // Fetch all destinations for dropdown
  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setDestinations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setLoading(false);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  // Delete a transport
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transport?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/transports/${id}`, config);
        fetchTransports(); // Refresh the transport list
        toast.success('Transport deleted successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Error deleting transport:', error);
        setLoading(false);
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Editing transport...');

    try {
      await axios.put(`http://localhost:5000/api/admin/transports/${editId}`, editFormData, config);
      setEditId(null); // Exit edit mode
      fetchTransports(); // Refresh the transport list
      setLoading(false);
      toast.success('Transport updated successfully!');
    } catch (error) {
      console.error('Error updating transport:', error);
      setLoading(false);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  // Start editing a transport
  const handleEditClick = (transport) => {
    setEditId(transport._id);
    setEditFormData({
      type: transport.type || 'Unknown',
      from: transport.from?._id || '',
      to: transport.to?._id || '',
      price: transport.price || 'Unknown'
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
        <Button variant="contained" color="primary" onClick={() => navigate('/addtransport')} style={styles.button}>
          Add Transport
        </Button>
        <Typography variant="h4" gutterBottom>
          Transport Table
        </Typography>
        {editId ? (
          <form onSubmit={handleEditFormSubmit} style={styles.form}>
            <Select
              name="type"
              value={editFormData.type}
              onChange={handleEditFormChange}
              required
              variant="outlined"
              fullWidth
              style={styles.select}
            >
              <MenuItem value="">Select Transport Type</MenuItem>
              <MenuItem value="train">Train</MenuItem>
              <MenuItem value="bus">Bus</MenuItem>
              <MenuItem value="AeroPlane">Aeroplane</MenuItem>
            </Select>
            <Select
              name="from"
              value={editFormData.from}
              onChange={handleEditFormChange}
              required
              variant="outlined"
              fullWidth
              style={styles.select}
            >
              <MenuItem value="">Select Source</MenuItem>
              {sources.map((source) => (
                <MenuItem key={source._id} value={source._id}>
                  {source.name || 'Unknown'}
                </MenuItem>
              ))}
            </Select>
            <Select
              name="to"
              value={editFormData.to}
              onChange={handleEditFormChange}
              required
              variant="outlined"
              fullWidth
              style={styles.select}
            >
              <MenuItem value="">Select Destination</MenuItem>
              {destinations.map((destination) => (
                <MenuItem key={destination._id} value={destination._id}>
                  {destination.name || 'Unknown'}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Price"
              name="price"
              value={editFormData.price}
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
                  <TableCell>Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transports.map((transport) => (
                  <TableRow key={transport._id}>
                    <TableCell>{transport.type || 'Unknown'}</TableCell>
                    <TableCell>{transport.from?.name || 'Unknown'}</TableCell>
                    <TableCell>{transport.to?.name || 'Unknown'}</TableCell>
                    <TableCell>{transport.price || 'Unknown'}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditClick(transport)} variant="outlined" color="primary">
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(transport._id)} variant="outlined" color="error">
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

export default TransportTable;