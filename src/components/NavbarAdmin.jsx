import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function NavbarAdmin() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear localStorage and logout the user
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        logout();

        // Redirect to the login page
        window.location.href = '/';
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976D2' }}> {/* Change color here */}
            <Toolbar>
                <Typography variant="h6" onClick={() => handleNavigation('/admin-dashboard')} sx={{ cursor: 'pointer', flexGrow: 1 }}>
                    Travel
                </Typography>
                <Button color="inherit" onClick={() => handleNavigation('/destination')}>Place</Button>
                <Button color="inherit" onClick={() => handleNavigation('/hotel')}>Hotel</Button>
                <Button color="inherit" onClick={() => handleNavigation('/transport')}>Transport</Button>
                <Button color="inherit" onClick={() => handleNavigation('/package')}>Package</Button>
                <Button color="inherit" onClick={() => handleNavigation('/admin-packages')}>Applied Package</Button>
                <Button color="inherit" onClick={() => handleNavigation('/admin-gallery')}>Gallery</Button>
                <Button color="inherit" onClick={() => handleNavigation('/admin-contact')}>Contact Us</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavbarAdmin;
