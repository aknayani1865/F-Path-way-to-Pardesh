import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../components/NavbarUser';
import { Card, CardMedia, CardContent, Typography, Button, Stack, Divider, CardActions, IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';

const FavoritePackagesPage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user ID from localStorage
  const userId = user._id;
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [appliedPackages, setAppliedPackages] = useState([]); // State to store applied packages
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/favorites`, config);
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch favorite packages', err);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    const fetchAppliedPackages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}/bookings`, config);
        setAppliedPackages(response.data);
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch applied packages', err);
        setLoading(false)
      }
    };

    fetchAppliedPackages();
  }, [userId]);

  const handleRemoveFavorite = async (pkgId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}/favorites/${pkgId}`, config);
      setFavorites(favorites.filter(fav => fav._id !== pkgId));
      setLoading(false)
    } catch (err) {
      console.error('Failed to remove favorite package', err);
      setLoading(false)
    }
  };

  const handleApply = (pkg) => {
    navigate('/apply-package', { state: { package: pkg } });
  };

  const isApplyButtonDisabled = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const deadline = new Date(start);
    deadline.setDate(start.getDate() - 3);

    return today > deadline;
  };

  
  return (
    <>
      <NavbarUser />
     {
      loading ? (
        <div><LoadingSpinner/></div>
      ):(
        <div style={styles.gridContainer}>
        {favorites.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            No favorite packages.
          </Typography>
        ) : (
          favorites.map((pkg, index) => (
            <Card key={index} sx={{ maxWidth: 345, margin: '20px', borderRadius: '12px', boxShadow: 3 }}>
              {pkg.images && (
                <CardMedia
                  component="img"
                  height="140"
                  image={pkg.images[0]?.url || '/placeholder.svg'}
                  alt={pkg.name || 'Unknown'}
                  style={{ borderRadius: '12px 12px 0 0' }}
                />
              )}
              <CardContent>
                <Stack spacing={3}>
                  <Typography gutterBottom variant="h5" component="div">
                    {pkg.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Source:</strong> {pkg.source.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Destination:</strong> {pkg.destination?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Start Date:</strong> {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>End Date:</strong> {pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Nights:</strong> {pkg.nights || 'Unknown'}
                  </Typography>
                  <Typography variant="h6" color="blue.600">
                    ₹{pkg.totalPrice || 'Unknown'}
                  </Typography>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions>
                {appliedPackages.some(appliedPkg => appliedPkg.package._id === pkg._id) ? (
                  <Button variant="contained" color="secondary" disabled sx={{ flexGrow: 1 }}>
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApply(pkg)}
                    disabled={isApplyButtonDisabled(pkg.startDate)}
                    sx={{ flexGrow: 1 }}
                  >
                    {isApplyButtonDisabled(pkg.startDate) ? 'Registration Closed' : 'Apply'}
                  </Button>
                )}
                <IconButton onClick={() => handleRemoveFavorite(pkg._id)}>
                  <Favorite sx={{ color: 'red' }} />
                </IconButton>
              </CardActions>
            </Card>
          ))
        )}
      </div>
      )
     }
    </>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
  },
};

export default FavoritePackagesPage;
