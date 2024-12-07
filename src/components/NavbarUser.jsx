// src/components/NavbarUser.jsx
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function NavbarUser() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Example: Retrieve token from localStorage

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        logout();
        window.location.href = '/';
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false); // Close menu when navigating
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleMobileMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography
                    variant="h6"
                    onClick={() => handleNavigation('/')}
                    style={{ cursor: 'pointer', flexGrow: 1 }}
                >
                    Travel
                </Typography>
                {isMobile ? (
                    <>
                        <IconButton color="inherit" onClick={toggleMobileMenu}>
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </IconButton>
                        {menuOpen && (
                            <div style={{ position: 'absolute', top: '64px', right: '0', backgroundColor: '#1976d2', width: '100%', textAlign: 'center', zIndex: 10,display: 'flex', flexDirection: 'column' }}>
                                <Button color="inherit" onClick={() => handleNavigation('/gallery')}>Gallery</Button>
                                <Button color="inherit" onClick={() => handleNavigation('/contact-us')}>Contact Us</Button>
                                {token && (
                                    <>
                                        <Button color="inherit" onClick={() => handleNavigation('/my-trips')}>My Trip</Button>
                                        <Button color="inherit" onClick={() => handleNavigation('/favorite-packages')}>Favorite</Button>
                                        <Button color="inherit" onClick={() => handleNavigation('/profile')}>My Profile</Button>
                                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                                    </>
                                )}
                                {!token && (
                                    <>
                                        <Button color="inherit" onClick={() => handleNavigation('/login')}>Login</Button>
                                        <Button color="inherit" onClick={() => handleNavigation('/signup')}>Signup</Button>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {token && (
                            <>
                                <Button color="inherit" onClick={() => handleNavigation('/my-trips')}>My Trip</Button>
                                <Button color="inherit" onClick={() => handleNavigation('/favorite-packages')}>Favorite</Button>
                            </>
                        )}
                        <Button color="inherit" onClick={() => handleNavigation('/gallery')}>Gallery</Button>
                        <Button color="inherit" onClick={() => handleNavigation('/contact-us')}>Contact Us</Button>
                        {token ? (
                            <>
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <FaUserCircle />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>My Profile</MenuItem>
                                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => handleNavigation('/login')}>Login</Button>
                                <Button color="inherit" onClick={() => handleNavigation('/signup')}>Signup</Button>
                            </>
                        )}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavbarUser;
