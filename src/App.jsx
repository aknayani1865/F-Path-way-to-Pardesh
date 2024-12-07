import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import 'bootstrap/dist/css/bootstrap.min.css';


import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardPage1 from "./pages/DashboardPage1";
import AdminDashboardPage from "./pages/AdminDashboardPage"; // Admin Dashboard (new file)
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import AddDestinationForm from './components/AddDestinationForm';
import AddHotelForm from './components/AddHotel';
import AddTransportForm from './components/AddTransport';
import AddPackage from './components/AddPackage';
import AddSourceForm from './components/AddSource';
import PackageDataFetcher from './components/GetPackages';
import DestinationTable from "./components/DestinationTable";
import SourceTable from "./components/Sources";
import HotelTable from "./components/HotelTable";
import TransportTable from "./components/TransportTable";
import PackageTable from "./components/PackageTable";
import ApplyPackagePage from "./pages/ApplyPackagePage";
import MyTripsPage from "./pages/MyTripsPage";
import AppliedPackage from "./components/AppliedPackage";
import UserPackage from "./components/UserPackage";
import FavoritePackagesPage from "./pages/FavoritePackagesPage";
import GalleryPage from "./pages/GalleryPage";
import Contactus from "./pages/Contactus";
import ProfilePage from "./pages/ProfilePage";
import AdminGalleryPage from "./components/AdminGalleryPage";
import AddGallery from "./components/AddGallery";
import AdminContactUs from "./components/AdminContactUs";
// protect routes that require authentication
const ProtectedRoute = ({ children,requiredRole }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}
	if (requiredRole && user.role !== requiredRole) {
		// If the user role doesn't match the required role, redirect accordingly
		return user.role === "admin" 
		? <Navigate to='/admin-dashboard' replace />
		: <Navigate to='/' replace />; // Default user dashboard
	}
	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return user.role === "admin" 
      ? <Navigate to='/admin-dashboard' replace />
      : <Navigate to='/' replace />; // Default user dashboard
	}

	return children;
};

function App() {
	const { isAuthenticated, user, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<div
			className='min-h-screen bg-gradient-to-br
    relative overflow-hidden'
		>
			{/* <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} /> */}

			<Routes>
				<Route
					path='/'
					element={
						isAuthenticated && user.role === "admin" ? (
							<Navigate to='/admin-dashboard' replace />
						) : (
							<DashboardPage1 />
						)
					}		
				/>
				<Route
					path='/favorite-packages'
					element={
						<ProtectedRoute requiredRole="user">
							<FavoritePackagesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/gallery'
					element={
							<GalleryPage />
					}
				/>
				<Route
					path='/dashboard'
					element={
							<DashboardPage />
					}
				/>
				<Route
					path='/admin-contact'
					element={
						<ProtectedRoute requiredRole="admin">
							<AdminContactUs />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/add-photo'
					element={
						<ProtectedRoute requiredRole="admin">
							<AddGallery />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin-gallery'
					element={
						<ProtectedRoute requiredRole="admin">
							<AdminGalleryPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<ProtectedRoute requiredRole="user">
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/contact-us'
					element={
							<Contactus />
					}
				/>
				<Route
					path='/my-trips'
					element={
						<ProtectedRoute requiredRole="user">
							<MyTripsPage />
						</ProtectedRoute>
					}
				/>
				{/* Admin dashboard, protected by role */}
				<Route path='/admin-dashboard'
        element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
			<Route path='/adddestination' element={ 
				<ProtectedRoute requiredRole="admin">
				<AddDestinationForm />
			</ProtectedRoute>
			}
			/>
			<Route path='/destination' element={ 
				<ProtectedRoute requiredRole="admin">
				<DestinationTable/>
			</ProtectedRoute>
			}
			/>
			<Route path='/addsource' element={
            <ProtectedRoute requiredRole="admin">
              <AddSourceForm />
            </ProtectedRoute>
          } />
		<Route path='/source' element={
            <ProtectedRoute requiredRole="admin">
              <SourceTable></SourceTable>
            </ProtectedRoute>
          } />
				<Route path='/addhotel' element={
            <ProtectedRoute requiredRole="admin">
              <AddHotelForm />
            </ProtectedRoute>
          } />
		<Route path='/hotel' element={
            <ProtectedRoute requiredRole="admin">
              <HotelTable></HotelTable>
            </ProtectedRoute>
          } />
				<Route path='/addtransport' element={<ProtectedRoute requiredRole="admin">
              <AddTransportForm />
            </ProtectedRoute>} />
			<Route path='/transport' element={
            <ProtectedRoute requiredRole="admin">
              <TransportTable></TransportTable>
            </ProtectedRoute>
          } />
				<Route path='/addpackage' element={ <ProtectedRoute requiredRole="admin">
              <AddPackage />
            </ProtectedRoute>} />
				<Route path='/getpackage' element={ <ProtectedRoute requiredRole="admin">
              <PackageDataFetcher />
            </ProtectedRoute>} />
			<Route path='/package' element={
            <ProtectedRoute requiredRole="admin">
              <PackageTable></PackageTable>
            </ProtectedRoute>
          } />
		<Route path='/apply-package' element={
              <ApplyPackagePage></ApplyPackagePage>
          } />
		<Route path='/admin-packages' element={
            <ProtectedRoute requiredRole="admin">
              <AppliedPackage></AppliedPackage>
            </ProtectedRoute>
          } />
		<Route path='/:packageId' element={
            <ProtectedRoute requiredRole="admin">
              <UserPackage></UserPackage>
            </ProtectedRoute>
          } />
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
