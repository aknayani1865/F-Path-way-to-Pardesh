import { useState } from "react";
import { Mail, Loader, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input"; // Assuming you're still using your custom Input
import { useAuthStore } from "../store/authStore";
import { Button, Typography, TextField, Box, CircularProgress, Paper } from "@mui/material";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<Box
			minHeight="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center"
			sx={{
				background: "linear-gradient(135deg, #ece9e6, #ffffff)",
			}}
		>
			<Toaster />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Paper elevation={10} sx={{ padding: 4, borderRadius: "16px", maxWidth: 400, width: "600px" }}>
					<Typography variant="h4" align="center" gutterBottom>
						Forgot Password
					</Typography>
					{!isSubmitted ? (
						<form onSubmit={handleSubmit}>
							<Typography className='text-black-100 mb-6 text-center'>
								Enter your email address and we'll send you a link to reset your password.
							</Typography>
							<Box mb={3} mt={2}>
								<TextField
									fullWidth
									variant="outlined"
									label="Email Address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									InputProps={{
										startAdornment: <Mail style={{ marginRight: 8 }} />,
									}}
									required
								/>
							</Box>

							<Button
								fullWidth
								type="submit"
								variant="contained"
								color="primary"
								disabled={isLoading}
								sx={{ paddingY: 1.5 }}
								component={motion.button}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{isLoading ? <CircularProgress size={24} /> : "Send Reset Link"}
							</Button>
						</form>
					) : (
						<div className='text-center'>
							<Box display="flex" justifyContent="center" mb={4}>
								<Mail className='h-8 w-8 text-gray-500' />
							</Box>
							<Typography className='text-black-100 mb-6'>
								If an account exists for {email}, you will receive a password reset link shortly.
							</Typography>
						</div>
					)}

					<Box display="flex" justifyContent="flex-start" mt={3}>
						<Link to={"/login"} style={{ textDecoration: "none" }}>
							<Typography variant="body2" color="primary" display="flex" alignItems="center">
								<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
							</Typography>
						</Link>
					</Box>
				</Paper>
			</motion.div>
		</Box>
	);
};

export default ForgotPasswordPage;