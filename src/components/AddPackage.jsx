import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select, Typography, Grid } from '@mui/material';

const AddPackage = () => {
  const [packageData, setPackageData] = useState({
    name: '',
    sourceId: '',
    destinationId: '',
    hotelId: '',
    transportId: '',
    startDate: '',
    endDate: '',
    basePrice: '',
    totalDistance: '',
    images: [], // Changed to handle multiple images
    pdf: '', // Added to handle PDF
    description: ''
  });
  const navigate = useNavigate();
  const today = new Date();
  const minStartDate = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
  const [sourceId, setSourceId] = useState([]);
  const [destinationId, setDestinationId] = useState([]);
  const [hotelId, setHotelId] = useState([]);
  const [transportId, setTransportId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        };
        const [sourcesRes, destinationsRes, hotelsRes, transportsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/places', config),
          axios.get('http://localhost:5000/api/admin/places', config),
          axios.get('http://localhost:5000/api/admin/hotels', config),
          axios.get('http://localhost:5000/api/admin/transports', config)
        ]);
        setSourceId(sourcesRes.data);
        setDestinationId(destinationsRes.data);
        setHotelId(hotelsRes.data);
        setTransportId(transportsRes.data);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
        setError(error.response ? error.response.data.message : 'Failed to fetch initial data. Please refresh the page.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prev => ({ ...prev, [name]: value }));
  };

  // Handling multiple image file inputs and converting them to Base64
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Get the list of selected files
    files.forEach(file => {
      setFileToBase(file);
    });
  };

  // Convert each file to Base64 and add it to the images array
  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPackageData(prev => ({
        ...prev,
        images: [...(prev.images || []), reader.result] // Append each Base64 image to the array
      }));
    };
  };

  // Handling PDF file input and converting it to Base64
  const handlePdfChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setFileToBasePdf(file);
  };

  // Convert the PDF file to Base64 and set it in the state
  const setFileToBasePdf = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPackageData(prev => ({
        ...prev,
        pdf: reader.result // Set the Base64 PDF in the state
      }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Show loading toast
    const loadingToast = toast.loading('Creating package...');

    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      };
      await axios.post('http://localhost:5000/api/admin/packages', packageData, config);
      setPackageData({
        name: '',
        sourceId: '',
        destinationId: '',
        hotelId: '',
        transportId: '',
        startDate: '',
        endDate: '',
        basePrice: '',
        totalDistance: '',
        images: [],
        pdf:'',
        description: ''
      });
      toast.success('Package created successfully!');
      navigate('/package');
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error(error.response ? error.response.data.message : 'Error updating package. Please try again.'); // Error toast
      setError('Error creating package. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast
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
          Add New Package
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Package Name"
                variant="outlined"
                fullWidth
                name="name"
                value={packageData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Source</InputLabel>
                <Select
                  label="Source"
                  name="sourceId"
                  value={packageData.sourceId}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Source</em>
                  </MenuItem>
                  {sourceId.map(source => (
                    <MenuItem key={source._id} value={source._id}>
                      {source.name || 'Unknown'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Destination</InputLabel>
                <Select
                  label="Destination"
                  name="destinationId"
                  value={packageData.destinationId}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Destination</em>
                  </MenuItem>
                  {destinationId.map(destination => (
                    <MenuItem key={destination._id} value={destination._id}>
                      {destination.name || 'Unknown'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Transport</InputLabel>
                <Select
                  label="Transport"
                  name="transportId"
                  value={packageData.transportId}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Transport</em>
                  </MenuItem>
                  {transportId.map(transport => (
                    <MenuItem key={transport._id} value={transport._id}>
                      {transport.type || 'Unknown'} from {transport.from?.name || 'Unknown'} to {transport.to?.name || 'Unknown'} - ₹{transport.price || 'Unknown'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Hotel</InputLabel>
                <Select
                  label="Hotel"
                  name="hotelId"
                  value={packageData.hotelId}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Hotel</em>
                  </MenuItem>
                  {hotelId.map(hotel => (
                    <MenuItem key={hotel._id} value={hotel._id}>
                      {hotel.name || 'Unknown'} - {hotel.place?.name || 'Unknown'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date"
                type="date"
                variant="outlined"
                fullWidth
                name="startDate"
                value={packageData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minStartDate }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="End Date"
                type="date"
                variant="outlined"
                fullWidth
                name="endDate"
                value={packageData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minStartDate }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Base Price"
                type="number"
                variant="outlined"
                fullWidth
                name="basePrice"
                value={packageData.basePrice}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Total Distance"
                type="number"
                variant="outlined"
                fullWidth
                name="totalDistance"
                value={packageData.totalDistance}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Package Description"
                variant="outlined"
                fullWidth
                name="description"
                value={packageData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple // Allow multiple images to be selected
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              
              {/* Check if there are images and display them */}
              {packageData.images && packageData.images.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                  {packageData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Package ${index + 1}`}
                      style={{ maxWidth: '200px', maxHeight: '150px', marginRight: '10px', marginBottom: '10px' }}
                    />
                  ))}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handlePdfChange}
                />
              </Button>
              
              {/* Check if there is a PDF and display its name */}
              {packageData.pdf && (
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                  PDF Uploaded
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                style={{ backgroundColor: 'black', color: 'white' }}
              >
                {isLoading ? 'Creating...' : 'Create Package'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};

export default AddPackage;