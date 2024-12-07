import React, { useState } from 'react';
import axios from 'axios';
import NavbarUser from "../components/NavbarUser";
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

const Contactus = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/contact', contactData);
      toast.success('Message sent successfully!');
      setContactData({
        name: '',
        email: '',
        description: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response ? error.response.data.message : 'Error sending message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarUser />
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Contact Us</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={contactData.name}
            onChange={handleChange}
            required
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            name="email"
            value={contactData.email}
            onChange={handleChange}
            required
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={contactData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            style={{ marginBottom: '10px' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Container>
    </>
  );
};

export default Contactus;