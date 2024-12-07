import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';

const PackageDataFetcher = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/packages', config); // Adjust the endpoint as needed
      setPackages(response.data);
    } catch (error) {
      setError('Failed to fetch packages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarAdmin></NavbarAdmin>
      <div>
        <button onClick={() => navigate(-1)}>Back</button>
        <h2 style={{ fontSize: "25px" }}>Package Data</h2>
        <button onClick={fetchPackages} style={{ backgroundColor: "black", color: "white" }} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Packages'}
        </button>
        {error && <p className="error">{error}</p>}
        {packages.length > 0 && (
          <ul>
            {packages.map(pkg => (
              <li key={pkg._id}>
                <strong>Package Name:</strong> {pkg.name || 'Unknown'}<br />
                <strong>Source:</strong> {pkg.source?.name || 'Unknown'}<br />
                <strong>Destination:</strong> {pkg.destination?.name || 'Unknown'}<br />
                <strong>Hotel:</strong> {pkg.hotel?.name || 'Unknown'}<br />
                <strong>Transport: </strong>
                {pkg.transports ? (
                  <span>
                    {pkg.transports.type || 'Unknown'} from {pkg.transports.from?.name || 'Unknown'} to {pkg.transports.to?.name || 'Unknown'} - ₹{pkg.transports.price || 'Unknown'}
                  </span>
                ) : (
                  'No transport available'
                )}<br />
                <strong>Start Date:</strong> {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : 'Unknown'}<br />
                <strong>End Date:</strong> {pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : 'Unknown'}<br />
                <strong>Total Price:</strong> ₹{pkg.totalPrice || 'Unknown'}<br />
                <strong>Total Distance:</strong> {pkg.totalDistance ? `${pkg.totalDistance} km` : 'Unknown'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PackageDataFetcher;