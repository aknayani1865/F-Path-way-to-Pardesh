import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Heart, MapPin, Star, Clock, Plane, Calendar, CalendarCheck } from 'lucide-react';
import NavbarUser from '../components/NavbarUser';
import { Card, CardMedia, CardContent, Typography, Button, Stack, Divider, CardActions, IconButton, TextField , Grid, Container } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPages.css'; // Import your CSS files here
import './DashboardPage.css';

const FavoritePackagesPage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const { user } = useAuthStore(); // Get user from context
  let userId ;
  if(user){
    userId = user._id;
  }
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
        const response = await axios.get(`https://b-path-way-to-pardesh.onrender.com/api/admin/users/${userId}/favorites`, config);
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
        const response = await axios.get(`https://b-path-way-to-pardesh.onrender.com/api/admin/user/${userId}/bookings`, config);
        setAppliedPackages(response.data);
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch applied packages', err);
        setLoading(false)
      }
    };

    fetchAppliedPackages();
  }, [userId]);
  const handleFavoriteToggle = async (pkg) => {
    try {
      if (favorites.some(fav => fav._id === pkg._id)) {
        // console.log(`Removing package ${pkg._id} from favorites`);
        await axios.delete(`https://travel-backend-jr66.onrender.com/api/admin/users/${userId}/favorites/${pkg._id}`, config);
        setFavorites(favorites.filter(fav => fav._id !== pkg._id));
      } else {
        // console.log(`Adding package ${pkg._id} to favorites`);
        await axios.post(`https://travel-backend-jr66.onrender.com/api/admin/users/${userId}/favorites/${pkg._id}`, {}, config);
        setFavorites([...favorites, pkg]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite package', err);
    }
  };
  const handleRemoveFavorite = async (pkgId) => {
    try {
      await axios.delete(`https://b-path-way-to-pardesh.onrender.com/api/admin/users/${userId}/favorites/${pkgId}`, config);
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
  const handleButtonClick = (pkg) => {
    if (!token && !userId) {
      // Redirect to login if not logged in
      navigate('/login');
    } else {
      // Run the favorite toggle functionality
      handleFavoriteToggle(pkg);
    }
  };
  const calculateDaysRemaining = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const difference = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    
    if (difference >= 0) {
      return `${difference} days`;
    } 
    else {
      return 'Registration closed';
    }
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
            <Card key={index} sx={styles.card}>
  <div style={{ position: 'relative' }}>
    {pkg.images && (
      <CardMedia
        component="img"
        height="140"
        image={pkg.images[0]?.url || '/placeholder.svg'}
        alt={pkg.name || 'Unknown'}
        style={{
      ...styles.cardMedia,
      width: '100%', 
      height: '200px',
      objectFit: 'cover', 
      borderRadius: '8px'
    }}
      />
    )}
    
    <IconButton
      onClick={() => handleButtonClick(pkg)}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
      }}
    >
      {!token && !userId ? (
        <FavoriteBorder sx={{ color: 'black' }} />
      ) : favorites.some(fav => fav._id === pkg._id) ? (
        <Favorite sx={{ color: 'red' }} />
      ) : (
        <FavoriteBorder sx={{ color: 'black' }} />
      )}
    </IconButton>
  </div>

  <CardContent>
    <Stack spacing={3}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{pkg.name || 'Unknown'}</h3>
        <p className="text-lg font-bold text-blue-600">₹{pkg.totalPrice || 'Unknown'}</p>
      </div>
      
      <div className="space-y-2 mb-3">
      <div className="mb-3 flex items-center gap-2 text-gray-600">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{pkg.destination?.name || 'Unknown'}</span>
      </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Plane className="h-4 w-4" />
          <div className="flex items-center gap-2 text-sm">
            <span>{pkg.source?.name || 'Unknown'}</span>
            <span>→</span>
            <span>{pkg.destination?.name || 'Unknown'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <div className="flex gap-2 text-sm">
            <span>{pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : 'Unknown'}</span>
            <span>→</span>
            <span>{pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>
        <Typography variant="body2" color="text.secondary">
        <strong>Nights:</strong> {pkg.nights || 'Unknown'}
      </Typography>
      </div>
     
      <div className="flex items-center justify-end border-t border-gray-100 py-1">
  <div className="flex justify-end gap-1 text-gray-600">
    <Clock className="h-4 w-4" />
    <span className="text-sm">{calculateDaysRemaining(pkg.startDate)}</span>
  </div>
</div>

    </Stack>
  </CardContent>
  <Divider />
  <CardActions sx={styles.cardActions}>
    {!token ? (
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700" onClick={() => handleApply1(pkg)}>
      <CalendarCheck className="h-5 w-5" />
      <span className="font-medium">Book Now</span>
    </button>
    ) : appliedPackages.some(appliedPkg => appliedPkg.package._id === pkg._id) ? (
      <Button variant="contained" color="secondary" disabled sx={{ flexGrow: 1 }}>
        Already Applied
      </Button>
    ) : (
     
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700" onClick={() => handleApply(pkg)}  disabled={isApplyButtonDisabled(pkg.startDate)}>
      <CalendarCheck className="h-5 w-5" />
      <span className="font-medium">{isApplyButtonDisabled(pkg.startDate) ? 'Registration Closed' : 'Book Now'}</span>
    </button>
    )}
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
