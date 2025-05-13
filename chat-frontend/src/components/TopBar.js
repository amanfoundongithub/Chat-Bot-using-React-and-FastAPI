import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Badge, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select } from '@mui/material';

const pages = [];
const settings = ['My Profile', 'My Subscriptions', 'Logout'];

function TopBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(false);

  // these would normally come from your user context / props
  const [name, setName] = React.useState("Aman Raj");
  const [age, setAge] = React.useState("30");
  const [gender, setGender] = React.useState("Male");
  const subscription = "FREE";

  const handleOpenNavMenu = e => setAnchorElNav(e.currentTarget);
  const handleOpenUserMenu = e => setAnchorElUser(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleProfileClick = () => {
    setOpenProfile(true);
    handleCloseUserMenu();
  };
  const handleProfileClose = () => setOpenProfile(false);

  const handleSaveProfile = () => {
    // TODO: persist values to your backend
    console.log({ name, age, gender });
    setOpenProfile(false);
  };

  return (
    <>
      <AppBar position = "fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              src="https://videos.openai.com/vg-assets/assets%2Ftask_01jv3zr6w4efza6bj0n8w3cnd7%2F1747111961_img_0.webp?st=2025-05-13T03%3A43%3A06Z&se=2025-05-19T04%3A43%3A06Z&sks=b&skt=2025-05-13T03%3A43%3A06Z&ske=2025-05-19T04%3A43%3A06Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=fvg3iO7%2B6Jx7IMHbrjw6vqXwC6NmjANMDPRH9R6NHVY%3D&az=oaivgprodscus"
              sx={{ mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
              }}
            >
              The LLM Co.
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map(p => (
                  <MenuItem key={p} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{p}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map(p => (
                <Button key={p} onClick={handleCloseNavMenu} sx={{ color: 'white' }}>
                  {p}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={name} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{ mt: '45px' }}
              >
                <MenuItem
                  sx={{ cursor: 'auto', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}
                >
                  <Typography mr={1}>{name}</Typography>
                  <Chip label={subscription} variant="outlined" color="warning" />
                </MenuItem>

                <Divider />

                {settings.map(setting => {
                  if (setting === 'My Profile') {
                    return (
                      <MenuItem key={setting} onClick={handleProfileClick}>
                        <Typography>{setting}</Typography>
                      </MenuItem>
                    );
                  }
                  return (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography>{setting}</Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Dialog */}
      <Dialog open={openProfile} onClose={handleProfileClose}>
        <DialogTitle>My Profile</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
            <TextField
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                label="Gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TopBar;
