import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import NavbarUser from '../components/NavbarUser';
import toast from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ApplyPackagePage.css';  // Importing CSS file

const ApplyPackagePage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const location = useLocation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { package: pkg } = location.state || {};
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [formFields, setFormFields] = useState([{ name: '', mobile: '', age: '' }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!pkg) {
    return <div>No package details available.</div>;
  }

  const handlePeopleChange = (number) => {
    const fields = Array.from({ length: number }, (_, index) => ({
      name: '',
      mobile: index === 0 ? '' : undefined, // Only the first person requires a mobile number
      age: '',
    }));
    setFormFields(fields);
    setNumberOfPeople(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!user) {
      toast.error('Please log in to apply for the package.');
      navigate('/login'); // Redirect to login page
      return;
    }
    try {
      // Calculate total cost
      const totalCost = formFields.reduce((total, field) => {
        if (field.age <= 5) {
          return total + (pkg.totalPrice / 2);
        }
        return total + pkg.totalPrice;
      }, 0);
  
      // Create booking and get Razorpay order ID
      const bookingResponse = await axios.post(
        `https://b-path-way-to-pardesh.onrender.com/api/admin/packages/${pkg._id}/apply`,
        {
          name: formFields[0].name,
          mobileNumber: formFields[0].mobile,
          people: formFields.map(({ name, age }) => ({ name, age })),
          userId: user._id,
          totalCost, // Include total cost in the request
        }
        ,config
      );
  
      const { orderId } = bookingResponse.data;
  
      // Initialize Razorpay options
      const options = {
        key: 'rzp_test_yYua3iOQU7suMS', // Your Razorpay key
        amount: totalCost * 100, // Convert to paise
        currency: 'INR',
        name: 'Travel Booking',
        description: 'Package Payment',
        order_id: orderId, // Razorpay order ID from backend
        handler: async (response) => {
          const loadingToast = toast.loading('Verification Payment...');
          try {
            // Verify the payment on backend
            const verifyResponse = await axios.post('https://b-path-way-to-pardesh.onrender.com/api/admin/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },config);
  
            toast.success('Payment successfully!');
            navigate('/'); // Redirect after success
          } catch (error) {
            toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
            setError(error.response ? error.response.data.message : 'Payment verification failed');
          }
          finally {
            toast.dismiss(loadingToast); 
          }
        },
        prefill: {
          name: formFields[0].name,
          email: user.email,
          contact: formFields[0].mobile,
        },
      };
  
      // Open Razorpay payment gateway
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setError(error.response ? error.response.data.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <NavbarUser></NavbarUser>
      <div className='akcontainer'>
      <div className='akpackageDetails'>
        <h2 className='akhead'>Package Details</h2>
        {pkg.images && (
            <Carousel showThumbs={false} dynamicHeight>
              {pkg.images.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={`${pkg.name || 'Unknown'} ${index + 1}`} className='akimage' />
                </div>
              ))}
            </Carousel>
          )}
        <h3 className='akhead'>{pkg.name || 'Unknown'}</h3>
        {pkg.description && (
          <p className='akdescription'>
          <strong className='akdescriptionStrong'>Description: </strong>
          {pkg.description || 'Unknown'}
          </p>
        )}
        <p><strong>Source:</strong> {pkg.source?.name || 'Unknown'}</p>
        <p><strong>Destination:</strong> {pkg.destination?.name || 'Unknown'}</p>
        <p><strong>Start Date:</strong> {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : 'Unknown'}</p>
        <p><strong>End Date:</strong> {pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : 'Unknown'}</p>
        <p><strong>Total Price:</strong> ₹{pkg.totalPrice || 'Unknown'}</p>
        
        <p><strong>InstructionPDF:</strong></p>
        {pkg.pdf && (
            <button onClick={() => window.open(pkg.pdf.url, '_blank')} className='akbutton'>
              View PDF
            </button>
          )}
      </div>
      <div className='akformContainer'>
        <h2 className='akhead'>Apply for Package</h2>
        <div className='akbuttonContainer'>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button key={num} onClick={() => handlePeopleChange(num)} className='akbutton'>
              {num}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className='akform'>
          {formFields.map((field, index) => (
            <div key={index} className='akfield'>
              <input
                type="text"
                placeholder="Name"
                value={field.name}
                onChange={(e) => {
                  const newFields = [...formFields];
                  newFields[index].name = e.target.value;
                  setFormFields(newFields);
                }}
                required
                style={{ backgroundColor: '#f4f4f4', color: '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
              />
              {field.mobile !== undefined && (
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={field.mobile}
                  onChange={(e) => {
                    const newFields = [...formFields];
                    newFields[index].mobile = e.target.value;
                    setFormFields(newFields);
                  }}
                  required
                  style={{ backgroundColor: '#f4f4f4', color: '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}

                />
              )}
              <input
                type="number"
                placeholder="Age"
                value={field.age}
                onChange={(e) => {
                  const newFields = [...formFields];
                  newFields[index].age = e.target.value;
                  setFormFields(newFields);
                }}
                required
                style={{ backgroundColor: '#f4f4f4', color: '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} 

              />
            </div>
          ))}
          <p>Total Price: ₹{formFields.reduce((total, field) => {
            if (field.age <= 5) {
              return total + (pkg.totalPrice / 2);
            }
            return total + pkg.totalPrice;
          }, 0)}</p>
          <button type="submit" className='akbutton' disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <div className='akerror'>{error}</div>}
        </form>
      </div>
    </div>
    </>
    
  );
};




export default ApplyPackagePage;
