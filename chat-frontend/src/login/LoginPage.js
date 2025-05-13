import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  Slide,
} from '@mui/material';
import { Google, Facebook, Visibility, VisibilityOff } from '@mui/icons-material';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Add login logic here
      alert('Login successful!');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f7fa"
    >
      <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
        <Card
          sx={{
            width: 400,
            p: 3,
            borderRadius: 4,
            boxShadow: 5,
            backgroundColor: '#fff',
          }}
        >
          <CardContent>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Welcome Back! 😊
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
              Let’s get you signed in and back to doing awesome things.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Link href="#" underline="hover" fontSize={14}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out, background-color 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    backgroundColor: '#1565c0',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<Google />}
                  sx={{ width: '48%', textTransform: 'none' }}
                >
                  Google
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Facebook />}
                  sx={{ width: '48%', textTransform: 'none' }}
                >
                  Facebook
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Slide>
    </Box>
  );
}
