import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select, Radio, RadioGroup, FormControlLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AddTransportForm = () => {
  const [type, setType] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [sources, setSources] = useState([]);
  const [transports, setTransports] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/places', config);
        setDestinations(response.data);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    };

    const fetchSources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/places', config);
        setSources(response.data);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    };

    const fetchTransports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/transports', config);
        setTransports(response.data);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    };

    fetchDestinations();
    fetchSources();
    fetchTransports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating transport...');

    try {
      await axios.post('http://localhost:5000/api/admin/transports', {
        type,
        from,
        to,
        price,
      }, config);
      setMessage('Transport added successfully!');
      setType('');
      setFrom('');
      setTo('');
      setPrice('');
      toast.success('Transport created successfully!');
      // Optionally refetch transports to update the list
      const response = await axios.get('http://localhost:5000/api/admin/transports', config);
      setTransports(response.data);
    } catch (error) {
      setMessage('Failed to add transport');
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
          Add Transport
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <FormControl component="fieldset" style={{ marginBottom: '16px' }}>
            <Typography variant="h6">Type</Typography>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <FormControlLabel value="train" control={<Radio />} label="Train" />
              <FormControlLabel value="bus" control={<Radio />} label="Bus" />
              <FormControlLabel value="AeroPlane" control={<Radio />} label="AiroPlane" />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
            <InputLabel>From</InputLabel>
            <Select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              label="From"
              required
            >
              <MenuItem value="">
                <em>Select a Source</em>
              </MenuItem>
              {sources.map((source) => (
                <MenuItem key={source._id} value={source._id}>
                  {source.name || 'Unknown'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
            <InputLabel>To</InputLabel>
            <Select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              label="To"
              required
            >
              <MenuItem value="">
                <em>Select a Destination</em>
              </MenuItem>
              {destinations.map((destination) => (
                <MenuItem key={destination._id} value={destination._id}>
                  {destination.name || 'Unknown'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ marginBottom: '16px' }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Transport
          </Button>
        </form>
        <Typography variant="h6" gutterBottom>
          Transport List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transports.map((transport) => (
                <TableRow key={transport._id}>
                  <TableCell>{transport.type || 'Unknown'}</TableCell>
                  <TableCell>{transport.from?.name || 'Unknown'}</TableCell>
                  <TableCell>{transport.to?.name || 'Unknown'}</TableCell>
                  <TableCell>₹{transport.price || 'Unknown'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default AddTransportForm;