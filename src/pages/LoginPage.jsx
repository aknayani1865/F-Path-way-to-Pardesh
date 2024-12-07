// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast, { Toaster } from "react-hot-toast";
import { Button, Typography, TextField, Box, CircularProgress, Paper } from "@mui/material";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user && !user.isVerified) {
        toast.error("Please verify your email.");
        navigate("/verify-email");
      }
    } catch (error) {
      console.error(error);
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
        padding: 2,
      }}
    >
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={10} sx={{ padding: 4, borderRadius: "16px", maxWidth: 400, width: '100%', mx: 'auto' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <form onSubmit={handleLogin}>
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
                sx={{ '& .MuiInputBase-input': { padding: '10px' } }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <Lock style={{ marginRight: 8 }} />,
                }}
                sx={{ '& .MuiInputBase-input': { padding: '10px' } }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
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
              {isLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Typography component="span" color="primary">
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
