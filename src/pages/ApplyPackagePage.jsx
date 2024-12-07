import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import NavbarUser from '../components/NavbarUser';
import toast from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
        `http://localhost:5000/api/admin/packages/${pkg._id}/apply`,
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
            const verifyResponse = await axios.post('http://localhost:5000/api/admin/payment/verify', {
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
      <div style={styles.container}>
      <div style={styles.packageDetails}>
        <h2 style={styles.head}>Package Details</h2>
        {pkg.images && (
            <Carousel showThumbs={false} dynamicHeight>
              {pkg.images.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={`${pkg.name || 'Unknown'} ${index + 1}`} style={styles.image} />
                </div>
              ))}
            </Carousel>
          )}
        <h3 style={styles.head}>{pkg.name || 'Unknown'}</h3>
        {pkg.description && (
          <p style={styles.description}>
          <strong style={styles.descriptionStrong}>Description: </strong>
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
            <button onClick={() => window.open(pkg.pdf.url, '_blank')} style={styles.button}>
              View PDF
            </button>
          )}
      </div>
      <div style={styles.formContainer}>
        <h2 style={styles.head}>Apply for Package</h2>
        <div style={styles.buttonContainer}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button key={num} onClick={() => handlePeopleChange(num)} style={styles.button}>
              {num}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {formFields.map((field, index) => (
            <div key={index} style={styles.field}>
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
                style={{ backgroundColor: '#f4f4f4', color: '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} // Customize styles here
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
                  style={{ backgroundColor: '#f4f4f4', color: '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} // Customize styles here

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
                style={{ backgroundColor: '#f4f4f4', color: '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} // Customize styles here

              />
            </div>
          ))}
          <p>Total Price: ₹{formFields.reduce((total, field) => {
            if (field.age <= 5) {
              return total + (pkg.totalPrice / 2);
            }
            return total + pkg.totalPrice;
          }, 0)}</p>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <div style={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
    </>
    
  );
};

const styles = {
  head: {
    fontSize:"24px",
    fontWeight : "bold",
    marginBottom:"15px",
    marginTop:"10px"
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
  },
  packageDetails: {
    flex: 1,
    marginRight: '20px',
  },
 image: {
    width: '100%', // Ensure it scales with the container
    maxWidth: '500px', // Set a max-width for medium size
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
 description: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    marginTop: '10px',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  descriptionStrong: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    transition: 'background-color 0.3s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default ApplyPackagePage;