import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Box, Button, CircularProgress, Paper, Typography, TextField } from "@mui/material";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();
	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);
			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

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
						Reset Password
					</Typography>
					{message && <Typography className="text-gray-100 text-sm mb-4">{message}</Typography>}

					<form onSubmit={handleSubmit}>
						<Box mb={3}>
							<TextField
								fullWidth
								variant="outlined"
								label="New Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								InputProps={{
									startAdornment: <Lock style={{ marginRight: 8 }} />,
								}}
								required
							/>
						</Box>

						<Box mb={3}>
							<TextField
								fullWidth
								variant="outlined"
								label="Confirm New Password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								InputProps={{
									startAdornment: <Lock style={{ marginRight: 8 }} />,
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
							{isLoading ? <CircularProgress size={24} /> : "Set New Password"}
						</Button>
					</form>
				</Paper>
			</motion.div>
		</Box>
	);
};

export default ResetPasswordPage;