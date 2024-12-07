import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarUser from "../components/NavbarUser";
import { Container, Typography, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
        if (user) {
          setUserData(user);
          setName(user.name); // Initialize name state
        } else {
          console.error('No user data found in localStorage');
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
        const userId = user._id;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put('http://localhost:5000/api/auth/profile', { name, userId }, config);
      console.log("response", response);
      setUserData(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Update localStorage
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarUser />
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom><strong>Profile</strong></Typography>
          {editMode ? (
            <>
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleEditToggle} style={{ marginTop: '20px', marginLeft: '10px' }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6"><strong>Name:</strong> {userData.name}</Typography>
              <Typography variant="h6"><strong>Email:</strong> {userData.email}</Typography>
              <Button variant="contained" color="primary" onClick={handleEditToggle} style={{ marginTop: '20px' }}>
                Edit
              </Button>
              <Button variant="contained" color="primary" onClick={() => navigate('/')} style={{ marginTop: '20px', marginLeft: '10px' }}>
            Back
          </Button>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default ProfilePage;
