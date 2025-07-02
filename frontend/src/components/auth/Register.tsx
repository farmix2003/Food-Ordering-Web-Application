import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Visibility, VisibilityOff, Restaurant } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../server/server";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    whatsAppNumber: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!formData.whatsAppNumber.trim()) {
      errors.whatsAppNumber = "WhatsApp number is required";
    }
    if (!formData.role.trim()) {
      errors.role = "Role is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }

    // Check passwords match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const getRoleValue = (role: string) => {
    if (role === "Client") return "ROLE_CUSTOMER";
    if (role === "Restaurant  Owner") return "ROLE_RESTAURANT_OWNER";
    return "";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const payload = {
      username: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      whatsAppNumber: formData.whatsAppNumber,
      password: formData.password,
      role: getRoleValue(formData.role),
    };
    console.log("Payload for registration:", payload);
    
    try {
      const response = await registerUser(
        payload.email,
        payload.password,
        payload.username,
        payload.phoneNumber,
        payload.whatsAppNumber,
        payload.role
      );
  console.log("Registration successful:", response);
      window.localStorage.setItem("token", response.jwt);
  window.localStorage.setItem("token_timestamp", Date.now().toString());
      navigate("/home");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value as string,
    }));
    if (validationErrors[name as string]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name as string]: "",
      }));
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Restaurant
              sx={{
                fontSize: 40,
                color: "secondary.main",
                mr: 1,
              }}
            />
            <Typography component="h1" variant="h4" color="secondary">
              Eat Ease
            </Typography>
          </Box>

          <Typography
            component="h2"
            variant="h6"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Create an Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              error={!!validationErrors.fullName}
              helperText={validationErrors.fullName}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="phoneNumber"
              autoFocus
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!validationErrors.phoneNumber}
              helperText={validationErrors.phoneNumber}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="whatsAppNumber"
              label="WhatsApp Number"
              name="whatsAppNumber"
              autoComplete="whatsAppNumber"
              autoFocus
              value={formData.whatsAppNumber}
              onChange={handleChange}
              error={!!validationErrors.whatsAppNumber}
              helperText={validationErrors.whatsAppNumber}
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              label="Role"
              value={formData.role}
              name="role"
              onChange={handleSelectChange}
              error={!!validationErrors.role}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="Restaurant Owner">Resturant Owner</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
            </Select>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              color="secondary"
              sx={{ mb: 3, py: 1.5 }}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>

            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{
                  color: "secondary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
