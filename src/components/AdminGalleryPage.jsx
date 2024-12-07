import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const AdminGalleryPage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/gallery', config);
        setPhotos(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch photos', err);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []); // Use an empty dependency array to run the effect only once

  const handleRemovePhoto = async (id) => {
    const loadingToast = toast.loading('Removing photo...');
    try {
      await axios.delete(`http://localhost:5000/api/admin/gallery/${id}`, config);
      setPhotos(photos.filter(photo => photo._id !== id));
      toast.success('Photo removed successfully');
      setLoading(false);
    } catch (err) {
      toast.error('Failed to remove photo');
      setLoading(false);
    }
    toast.dismiss(loadingToast);
  };

  const handleAddPhotoRedirect = () => {
    navigate('/add-photo');
  };

  return (
    <>
      <NavbarAdmin />
     {
      loading ? (
        <div><LoadingSpinner/></div>
      ):(
        <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Gallery
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddPhotoRedirect} sx={{ mt: 2 }}>
            Add New Photo
          </Button>
        </Box>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={photo.image.url} // Use the correct path to the image URL
                  alt="Gallery Image"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {photo.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="secondary" onClick={() => handleRemovePhoto(photo._id)}>
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      )
     }
    </>
  );
};

export default AdminGalleryPage;