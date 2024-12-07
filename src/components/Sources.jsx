import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import NavbarAdmin from './NavbarAdmin';

const SourceTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [sources, setSources] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSources();
  }, []);

  // Fetch all sources
  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/sources', config); // API route for sources
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  // Delete a source with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this source?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/sources/${id}`, config);
        fetchSources(); // Refresh the list after deletion
        toast.success('Source deleted successfully!');
      } catch (error) {
        console.error('Error deleting source:', error);
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Updating source...');

    try {
      await axios.put(`http://localhost:5000/api/admin/sources/${editId}`, editFormData, config);
      setEditId(null); // Exit edit mode
      fetchSources(); // Refresh the list
      toast.success('Source updated successfully!');
    } catch (error) {
      console.error('Error updating source:', error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  // Start editing a source
  const handleEditClick = (source) => {
    setEditId(source._id);
    setEditFormData({ name: source.name });
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <NavbarAdmin />
      <div style={styles.container}>
        <Button variant="contained" color="primary" onClick={() => navigate('/addsource')} style={styles.button}>
          Add Source
        </Button>
        <Typography variant="h4" gutterBottom>
          Source Table
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
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source._id}>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditClick(source)} variant="outlined" color="primary">
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(source._id)} variant="outlined" color="error">
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

export default SourceTable;
