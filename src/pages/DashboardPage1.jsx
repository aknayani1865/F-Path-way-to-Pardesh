import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Clock, Plane, Calendar, CalendarCheck } from 'lucide-react';
import NavbarUser from '../components/NavbarUser';
import { Card, CardMedia, CardContent, Typography, Button, Stack, Divider, IconButton, CardActions, TextField , Grid, Container} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPages.css'; // Import your CSS files here
import './DashboardPage.css';
import { color } from 'framer-motion';
const DashboardPage1 = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const { user } = useAuthStore(); // Get user from context
  let userId;
  if(user){
    userId = user._id;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [appliedPackages, setAppliedPackages] = useState([]); // State to store applied packages

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('https://travel-backend-jr66.onrender.com/api/admin/packages');
        setPackages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages');
        setLoading(false);
      }
    };
  
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`https://travel-backend-jr66.onrender.com/api/admin/users/${user._id}/favorites`, config);
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch favorite packages', err);
        setLoading(false);
      }
    };
  
    const fetchAppliedPackages = async () => {
      try {
        const response = await axios.get(`https://travel-backend-jr66.onrender.com/api/admin/user/${user._id}/bookings`, config);
        setAppliedPackages(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch applied packages', err);
        setLoading(false);
      }
    };
  
    // Call all fetch functions
    fetchPackages();
     // Check if user is logged in
     if (user && token) {
      fetchFavorites();
      fetchAppliedPackages();
    }
  }, [token]); // Combined dependencies

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

  
  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleApply = (pkg) => {
    navigate('/apply-package', { state: { package: pkg } });
  };
  const handleApply1 = (pkg) => {
    navigate('/apply-package', { state: { package: pkg } });
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
  const handleButtonClick1 = (pkg) => {
    if (!token && !userId) {
      // Redirect to login if not logged in
      navigate('/login');
    } else {
      // Run the apply functionality
      handleApply(pkg);
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
  
  const isApplyButtonDisabled = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const deadline = new Date(start);
    deadline.setDate(start.getDate() - 3);

    return today > deadline;
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
 <main className="w-full">
      <section className="w-full h-[100vh] bg-header bg-cover bg-no-repeat bg-center bg-color1 bg-blend-multiply bg-opacity-60">
        <section className="w-full">
          <NavbarUser />
        </section>

        {/* Main Content */}
        <section className="w-full flex justify-center mt-[180px]">
          <div className="w-[700px] md:w-[900px] container h-auto">
            <p className="w-full text-center uppercase text-white tracking-widest [word-spacing:8px] mb-4">
              Let's travel the India with us
            </p>
            <h1 className="w-full text-center text-white text-5xl md:text-7xl font-secondary uppercase tracking-widest">
              Your next trip is just a click away <span className="travol"></span>
            </h1>
          </div>
        </section>

        {/* Search Section */}
        <section className="w-full justify-center mt-[80px] hidden lg:flex relative">
          <div className="bg-white bg-opacity-40 container absolute w-[1000px] xl:w-[1200px] h-[0px] flex justify-center items-center backdrop-blur-lg">
            <div className="w-[950px] xl:w-[1100px] container h-auto absolute m-[10px]">
              <form action="" className="flex font-primary">
                {/* <input type="text" placeholder="where to?" className="" /> */}
                <div style={styles.searchContainer}>
                <TextField
        label="Search Packages"
        variant="outlined"
        fullWidth
        color='#fafafa'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          ...styles.textField,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black',
            },
            '&:hover fieldset': {
              borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'black',
            },
          },
          '& .MuiInputBase-input': {
            color: 'black',
          },
          '& .MuiInputLabel-root': {
            color: 'black',
          },
        }}
      />
      </div>
              </form>
            </div>
          </div>
        </section>
      </section>
    </main>
      
      <div style={styles.gridContainer}>
        {filteredPackages.map((pkg, index) => (
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

        ))}
      </div>
    </>
  );
};

const styles = {
  searchContainer: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  textField: {
    backgroundColor: 'white', // Set the background color to white
    width:'1000px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardMedia: {
    borderRadius: '12px 12px 0 0',
  },
  cardActions: {
    justifyContent: 'space-between',
  },
};

export default DashboardPage1;
