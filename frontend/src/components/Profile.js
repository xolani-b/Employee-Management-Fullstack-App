import React from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import SyncIcon from '@mui/icons-material/Sync';
import useAuth from '../hooks/useAuth';
import { clearSession } from '../services/authService';
import { notifyInfo } from '../utils/toast';

const roleLabels = {
  ADMIN: 'Admin / IT',
  HR: 'HR Officer',
  SUPERVISOR: 'Supervisor',
  MANAGER: 'Factory Manager',
  WORKER: 'Worker',
};

const statusLabels = {
  APPROVED: 'Approved',
  PENDING_APPROVAL: 'Waiting for approval',
  SUSPENDED: 'Suspended',
};

const moduleCards = [
  {
    title: 'Worker Self-Service',
    detail: 'Transport requests, payslip access, profile details, incidents, and general factory questions.',
    icon: <BadgeIcon color="primary" />,
  },
  {
    title: 'Supervisor Controls',
    detail: 'Attendance, shift checks, PPE walkarounds, machine assignments, and shift incident capture.',
    icon: <AdminPanelSettingsIcon color="primary" />,
  },
  {
    title: 'HR and Factory Oversight',
    detail: 'Approvals, suspensions, birthdays, notifications, transport exports, and site-level trends.',
    icon: <NotificationsActiveIcon color="primary" />,
  },
  {
    title: 'Offline Ready',
    detail: 'Forms can queue while offline and sync when the device has network again.',
    icon: <SyncIcon color="primary" />,
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const { authenticated, username, role, status } = useAuth();
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  React.useEffect(() => {
    if (!authenticated) setShowSnackbar(true);
  }, [authenticated]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    navigate('/login', { replace: true });
  };

  const handleLogout = () => {
    clearSession();
    notifyInfo('You have been signed out.');
    navigate('/login');
  };

  if (!authenticated) {
    return (
      <Snackbar open={showSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 9 }}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          You must be logged in to view your account.
        </Alert>
      </Snackbar>
    );
  }

  const displayRole = roleLabels[role] || role || 'Worker';
  const displayStatus = statusLabels[status] || status || 'Approved';
  const initials = (username || 'FW')
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box sx={{ minHeight: '100vh', py: 6, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 20px 55px rgba(15,23,42,0.12)' }}>
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Avatar sx={{ width: 116, height: 116, bgcolor: '#1E3C72', border: '4px solid #F5A623', fontSize: 34, fontWeight: 800 }}>
                  {initials}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', wordBreak: 'break-word' }}>
                  {username}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  <Chip icon={<SecurityIcon />} label={displayRole} color="primary" variant="outlined" />
                  <Chip label={displayStatus} color={status === 'SUSPENDED' ? 'error' : status === 'PENDING_APPROVAL' ? 'warning' : 'success'} variant="outlined" />
                </Stack>
                <Divider flexItem sx={{ my: 1 }} />
                <Button fullWidth variant="contained" startIcon={<DashboardIcon />} component={Link} to="/dashboard">
                  Open dashboard
                </Button>
                <Button fullWidth variant="outlined" color="secondary" startIcon={<LogoutIcon />} onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 20px 55px rgba(15,23,42,0.12)' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Account and access
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                Your login controls which dashboard views you can use. Admin and HR users manage approvals, sites, messages, birthdays, and reports, while supervisors
                run shift activity and workers use the self-service tools.
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={2}>
                {moduleCards.map(card => (
                  <Grid item xs={12} sm={6} key={card.title}>
                    <Paper
                      sx={{
                        p: 2,
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid rgba(30,60,114,0.12)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f7f9ff 100%)',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        {card.icon}
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {card.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {card.detail}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
