import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast, { Toaster } from "react-hot-toast";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress
} from "@mui/material";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);
	return (
		<Box
		sx={{
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		<Paper
			elevation={10}
			sx={{
				padding: 4,
				borderRadius: 2,
				backgroundColor: "rgba(255, 255, 255, 0.9)",
				maxWidth: 400,
				width: "100%",
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Typography variant="h4" align="center" gutterBottom>
					Verify Your Email
				</Typography>
				<Typography variant="body1" align="center" gutterBottom>
					Enter the 6-digit code sent to your email address.
				</Typography>

				<form onSubmit={handleSubmit}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							mb: 2,
						}}
					>
						{code.map((digit, index) => (
							<TextField
								key={index}
								inputRef={(el) => (inputRefs.current[index] = el)}
								type="text"
								inputProps={{ maxLength: 1 }}
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								variant="outlined"
								size="small"
								sx={{
									width: "50px",
									bgcolor: "#f5f5f5",
								}}
							/>
						))}
					</Box>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isLoading || code.some((digit) => !digit)}
						fullWidth
						sx={{
							padding: 1.5,
							borderRadius: 1,
						}}
					>
						{isLoading ? <CircularProgress size={24} /> : "Verify Email"}
					</Button>
				</form>
			</motion.div>
		</Paper>
	</Box>
	);
};
export default EmailVerificationPage;
