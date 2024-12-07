import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';

const AddGallery = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [galleryData, setGalleryData] = useState({
    image:'', // Changed to handle multiple images
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  // Convert  file to Base64 and add it to the images array
  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setGalleryData(prev => ({ ...prev, image: reader.result })); // Save Base64 image to packageData
    };
  };

  // Remove an image from the images array by index
  const handleRemoveImage = (index) => {
    setGalleryData(prev => ({
      ...prev,
      image: '' // Remove the image at the specified index
    }));
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Show loading toast
    const loadingToast = toast.loading('Adding photo...');

    if (galleryData.image === '') {
      alert('Please select at least one file to upload');
      setIsLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/gallery', galleryData, config);
      setGalleryData({
        images: '',
      });
      toast.success('Photo added successfully!');
      navigate('/admin-gallery');
    } catch (err) {
      console.error('Failed to add photo', err);
      toast.error(err.response ? err.response.data.message : 'Failed to add photo. Please try again.');
      setError('Failed to add photo. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  return (
    <>
      <NavbarAdmin />
      <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Photo
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleAddPhoto}>
            <input
              type="file"
              id='image'
              name='image'
              onChange={handleImageChange}
              accept="image/*"
              required
              style={{ display: 'block', margin: '20px 0' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Adding...' : 'Add Photo'}
            </Button>
          </form>
          
         
        </Box>
      </Container>
    </>
  );
};

export default AddGallery;