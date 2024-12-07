import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography } from '@mui/material';

const AddSourceForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sources, setSources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the sources to display in the table
    const fetchSources = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/api/admin/sources', config);
        setSources(response.data);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    };

    fetchSources();
  }, []);

  const handleSubmit = async (e) => {
    const loadingToast = toast.loading('Creating source...');
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:5000/api/admin/sources', { name }, config);
      setMessage('Source added successfully!');
      setName('');
      toast.success('Source created successfully!');
      // Optionally refetch sources to update the list
      const response = await axios.get('http://localhost:5000/api/admin/sources', config);
      setSources(response.data);
    } catch (error) {
      setMessage('Failed to add source');
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
          Add Source
        </Typography>
        {message && <Typography color="textSecondary" gutterBottom>{message}</Typography>}
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
          <Button type="submit" variant="contained" color="primary">
            Add Source
          </Button>
        </form>
        <Typography variant="h6" gutterBottom>
          Sources List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source._id}>
                  <TableCell>{source.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default AddSourceForm;
