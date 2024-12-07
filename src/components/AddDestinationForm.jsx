import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography } from '@mui/material';

const AddDestinationForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the destinations to display in the table
    const fetchDestinations = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/api/admin/places', config);
        setDestinations(response.data);
      } catch (error) {
        console.error('Failed to fetch places:', error);
      }
    };

    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    const loadingToast = toast.loading('Creating places...');
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:5000/api/admin/places', { name, description }, config);
      setMessage('Places added successfully!');
      setName('');
      setDescription('');
      toast.success('Place created successfully!');
      // Optionally refetch destinations to update the list
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setDestinations(response.data);
    } catch (error) {
      setMessage('Failed to add place');
      console.error(error);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    } finally {
      toast.dismiss(loadingToast);
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
          Add Place
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
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" variant="contained" color="primary">
            Add Place
          </Button>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination._id}>
                  <TableCell>{destination.name || 'Unknown'}</TableCell>
                  <TableCell>{destination.description || 'No description'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default AddDestinationForm;