import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import LoadingSpinner from './LoadingSpinner';

const UserPackage = () => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
        }
    };
    const { packageId } = useParams();
    const [packageDetails, setPackageDetails] = useState(null);
    const [appliedUsers, setAppliedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                // Fetch package details
                const response = await axios.get(`http://localhost:5000/api/admin/packages/${packageId}`, config);
                setPackageDetails(response.data);
                
                // Fetch applied users separately
                const usersResponse = await axios.get(`http://localhost:5000/api/admin/packages/${packageId}/applied-users`, config);
                setAppliedUsers(usersResponse.data);
                
                setLoading(false);
            } catch (error) {
                setError('An error occurred while fetching package details.');
                setLoading(false);
            }
        };

        fetchPackageDetails();
    }, [packageId]);

    const handleCallUser = (mobileNumber) => {
        alert(`Calling ${mobileNumber}...`); // Replace with actual call functionality
    };

    if (error) return <div>{error}</div>;

    return (
        <>
            <NavbarAdmin />
           {
            (loading || !packageDetails) ? (
              <div><LoadingSpinner/></div>
            ):(
                <div style={styles.container}>
                <div style={styles.packageDetails}>
                    <h2 style={styles.font_head}>Package Details</h2>
                    <h3 style={styles.font_head1}>{packageDetails.name || 'Unknown'}</h3>
                </div>
                <div style={styles.userContainer}>
                    <strong>Applied Users</strong>
                    {appliedUsers.length === 0 ? (
                        <p>No users have applied for this package.</p>
                    ) : (
                        <div style={styles.userList}>
                            {appliedUsers.map((user, index) => (
                                <div key={user._id} style={styles.userCard}>
                                    <div style={styles.userContent}>
                                        <div><strong>User {index + 1}:</strong></div>
                                        <div><strong>Name:</strong> {user.name || 'Unknown'}</div>
                                        <div><strong>Mobile Number:</strong> {user.mobileNumber || 'Unknown'}</div>
                                        <div><strong>Age(s):</strong> {user.age || 'Unknown'}</div>
                                        <div><strong>Email:</strong> {user.email || 'Unknown'}</div>
                                        <div><strong>Payment Status:</strong> {user.paymentStatus || 'Unknown'}</div>
                                        {user.paymentStatus === 'failed' || user.paymentStatus === 'pending' ? (
                                            <button 
                                                style={styles.callButton}
                                                onClick={() => handleCallUser(user.mobileNumber)}
                                            >
                                                Call User
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            )
           }
        </>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    font_head: {
        fontSize: '25px',
        fontWeight: 'Bold'
    },
    font_head1: {
        fontSize: '19px',
    },
    packageDetails: {
        marginBottom: '20px',
    },
    userContainer: {
        marginTop: '20px',
    },
    userList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    userCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    callButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default UserPackage;