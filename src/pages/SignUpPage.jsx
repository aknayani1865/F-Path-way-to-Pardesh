import { motion } from "framer-motion";
import Input from "../components/Input"; // You might need to modify this if you're not using MUI for inputs.
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
} from "@mui/material";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const role = "user";
      await signup(email, password, name, role);
      toast.success("Account created successfully! Please verify your email.");
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
      // toast.error(error.message || "Error signing up");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Container component="main" maxWidth="xs" className="min-h-screen bg-gradient-to-br
    flex items-center justify-center relative overflow-hidden">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            p: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
			marginTop:"10px"
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>

          <form onSubmit={handleSignUp}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Full Name"
              InputProps={{
                startAdornment: (
                  <User style={{ marginRight: "8px", color: "#888" }} />
                ),
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
			  sx={{ height: '40px', '& .MuiInputBase-input': { padding: '10px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Email Address"
              InputProps={{
                startAdornment: (
                  <Mail style={{ marginRight: "8px", color: "#888" }} />
                ),
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
			  sx={{ height: '40px', '& .MuiInputBase-input': { padding: '10px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Password"
              type="password"
              InputProps={{
                startAdornment: (
                  <Lock style={{ marginRight: "8px", color: "#888" }} />
                ),
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
			  sx={{ height: '40px', '& .MuiInputBase-input': { padding: '10px' } }}
            />
            <PasswordStrengthMeter password={password} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
            </Button>
          </form>

          <Grid container>
            <Grid item>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Login
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SignUpPage;
