import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { extractFetchError } from '../utils/apiError';
import { notifySuccess, notifyError, notifyWarning } from '../utils/toast';
import PasskeyPromptDialog from './PasskeyPromptDialog';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [passkeyPromptOpen, setPasskeyPromptOpen] = useState(false);
  const navigate = useNavigate();

  const finishSignup = async () => {
    setLoading(false);
    notifySuccess('Account request created. HR or Admin must approve it before login.');
    setSuccessOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notifyWarning('Those passwords do not match. Please re-enter them.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        await finishSignup();
      } else {
        setLoading(false);
        const message = await extractFetchError(response, 'We could not register that account. The username may already be taken.');
        notifyError(message);
      }
    } catch (err) {
      setLoading(false);
      notifyError('We could not reach the server (it may be waking up). Please try again in a moment.');
    }
  };

  const handlePasskeyPromptClose = () => {
    setPasskeyPromptOpen(false);
    navigate('/dashboard');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoToLogin = () => {
    setSuccessOpen(false);
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
        padding: 2,
        borderRadius: 6,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 960,
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.25)',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 0.9fr' },
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            color: '#1a1a1a',
            padding: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Request access
          </Typography>
          <Typography>Create a factory work app account. HR or Admin can approve the user before full dashboard access.</Typography>
          <Stack spacing={1.2}>
            {[
              { icon: <RocketLaunchIcon />, text: 'Worker, HR, supervisor, and manager dashboards' },
              { icon: <ShieldIcon />, text: 'Approved users only, with suspension support' },
              { icon: <CheckCircleIcon />, text: 'Transport, incidents, shifts, payslips, and machines' },
            ].map(item => (
              <Stack key={item.text} direction="row" spacing={1} alignItems="center">
                {item.icon}
                <Typography variant="body2">{item.text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <CardContent
          sx={{
            padding: { xs: 3, md: 4 },
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography variant="h5" component="h2" textAlign="center" sx={{ marginBottom: '0.5rem', fontWeight: 700 }}>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle confirm password visibility" onClick={handleToggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button fullWidth variant="contained" color="primary" type="submit" sx={{ py: 1.2 }}>
                Register
              </Button>
            )}
            <Typography textAlign="center" sx={{ marginTop: '1rem' }}>
              Already have an account?{' '}
              <Button color="primary" component="a" href="/login">
                Login
              </Button>
            </Typography>
          </form>
        </CardContent>
      </Card>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)} aria-labelledby="register-success-title">
        <DialogTitle id="register-success-title">Welcome aboard!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Your account request is saved. HR or Admin must approve it before you can access the dashboard.</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleGoToLogin}>
            Go to login
          </Button>
        </DialogActions>
      </Dialog>

      <PasskeyPromptDialog open={passkeyPromptOpen} onClose={handlePasskeyPromptClose} username={username} />
    </Box>
  );
};

export default Register;
