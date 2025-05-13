import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Slide,
    InputAdornment,
    IconButton,
    MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const steps = ['Enter Email', 'Verify OTP', 'Set Password', 'User Details'];


export default function SignupPage() {
    const router = useNavigate()
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState({
        email: '',
        otp: '',
        password: '',
        confirmPassword: '',
        name: '',
        gender: '',
        dob: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerify, setOtpVerify] = useState(false);

    const genders = ['Male', 'Female', 'Other'];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateStep = () => {
        const newErrors = {};
        if (activeStep === 0) {
            if (!form.email)
                newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(form.email))
                newErrors.email = 'Invalid email';

        } else if (activeStep === 1) {
            if (!form.otp)
                newErrors.otp = 'OTP is required';
            else if (Verify_OTP(form.email, form.otp) == false)
                newErrors.otp = "Invalid OTP!";

        } else if (activeStep === 2) {
            const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!form.password)
                newErrors.password = 'Password is required';
            else if (!strongPassword.test(form.password))
                newErrors.password =
                    'Use at least 8 characters, including uppercase, lowercase, and a number';
            if (form.password !== form.confirmPassword)
                newErrors.confirmPassword = 'Passwords do not match';
        } else if (activeStep === 3) {
            if (!form.name)
                newErrors.name = 'Name is required';
            if (!form.gender)
                newErrors.gender = 'Gender is required';
            if (!form.dob)
                newErrors.dob = 'Date of birth is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (activeStep === 0) {
                // Send OTP
                Send_OTP(form.email)
            }

            if (activeStep === steps.length - 1) {
                Sign_Up();
                return;
            }
            setActiveStep((prev) => prev + 1);
        }
    };


    /**
     * OTP Sending Handler 
     * @returns 
     */
    const Send_OTP = (email) => {
        axios.post("http://localhost:8000/otp/generate", {
            email: email
        })
            .then((res) => {
                if (res.status == 200) {
                    setOtpSent(true);
                } else {
                    throw Error();
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /**
     * OTP Verification Handler
     * @returns 
     */
    const Verify_OTP = (email, otp) => {
        axios.post("http://localhost:8000/otp/verify", {
            email: email,
            otp: otp
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.data.valid
                } else {
                    throw Error()
                }
            })
            .catch((err) => {
                console.log(err)
                return false
            })
    }

    /**
     * Sign Up Handler 
     * @returns 
     */
    const Sign_Up = () => {
        axios.post("http://localhost:8000/user/create", {
            name : form.name,
            email : form.email,
            password : form.password,
            gender : form.gender,
            dob : form.dob
        })
        .then((res) => {
            if(res.status == 200) {
                
                window.localStorage.setItem("id", res.data.id) 
                router("/home") 
            } else {
                throw Error();
            }
        })
        .catch((err) => {
            console.log(err) 
        })
    }





    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <TextField
                        fullWidth
                        label="Enter Your Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                );
            case 1:
                return (
                    <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            We’ve sent a 6-digit OTP to <b>{form.email}</b>. Please enter it below.
                        </Typography>
                        <TextField
                            fullWidth
                            label="OTP"
                            name="otp"
                            value={form.otp}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.otp}
                            helperText={errors.otp}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Create a strong password to secure your account!
                        </Typography>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                    </>
                );
            case 3:
                return (
                    <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Congrats! You are now on the last step!
                            Finish with a few details about yourself and you are all set!
                        </Typography>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            {genders.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={form.dob}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.dob}
                            helperText={errors.dob}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                );
            default:
                return null;
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
            <Slide direction="up" in mountOnEnter unmountOnExit>
                <Card sx={{ width: 450, p: 3, borderRadius: 4, boxShadow: 5, backgroundColor: '#fff' }}>
                    <CardContent>
                        <Typography variant="h5" textAlign="center" gutterBottom>
                            Sign Up 🎉
                        </Typography>
                        <Typography variant="subtitle1" textAlign="center" gutterBottom>
                            You are just few steps away from doing awesome things!
                        </Typography>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box>{renderStep()}</Box>

                        <Button
                            fullWidth
                            onClick={handleNext}
                            variant="contained"
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
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </CardContent>
                </Card>
            </Slide>
        </Box>
    );
}
