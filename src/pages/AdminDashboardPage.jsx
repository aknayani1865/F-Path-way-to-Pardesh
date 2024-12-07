// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
import NavbarAdmin from '../components/NavbarAdmin';

const HomePage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  // const navigate = useNavigate();
  // const { logout } = useAuthStore();

  // const navigateTo = (path) => {
  //   navigate(path);
  // };
  // const handleLogout = () => {
  //   // Clear localStorage and logout the user
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('token');
  //       logout();

  //   // Redirect to the login page
  //   navigate('/');
  // };
  return (
    <>
    <NavbarAdmin></NavbarAdmin>
      <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Travel Management System</h1>
      {/* <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleLogout}>Logout</button>
      </div> */}
    </div>
    </>
    
  );
};

// Simple styles for the component
const styles = {
  heading: {
    fontSize:"32px",
  },
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
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
};

export default HomePage;