import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import LoadingSpinner from './LoadingSpinner';

const AppliedPackage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/packages', config);
        setPackages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (packageId) => {
    navigate(`/${packageId}`);
  };

  return (
    <>
      <NavbarAdmin />
      {loading ? (
        <div><LoadingSpinner/></div>
      ):(
        <div style={styles.container}>
        <h1 style={styles.head}>All Packages</h1>
        <ul style={styles.packageList}>
          {packages.map((pkg, index) => (
            <li key={pkg._id} style={styles.packageItem}>
              <button onClick={() => handlePackageClick(pkg._id)} style={styles.packageButton}>
                <span style={styles.packageIndex}>{index + 1}.</span>
                <span style={styles.packageName}>{pkg.name || 'Unknown'}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      )}
    
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  head: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  packageList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  packageItem: {
    marginBottom: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
  },
  packageButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '15px',
    fontSize: '18px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    width: '100%',
    textAlign: 'left',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  packageButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.02)',
  },
  packageIndex: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  packageName: {
    flex: 1,
  },
};

export default AppliedPackage;