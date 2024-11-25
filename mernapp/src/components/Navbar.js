import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [cartView, setCartView] = useState(false); // To toggle cart modal
  const [anchorEl, setAnchorEl] = useState(null); // State for the menu
  const navigate = useNavigate();
  const cartItems = useCart(); // Directly using cart items from the context

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove user session
    navigate('/'); // Redirect to login page
  };

  const handleCartClick = () => {
    setCartView(true); // Show cart as a modal
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="sticky" color="error">
        <Container maxWidth="xl">
          {/* Modal for Cart */}
          <Modal open={cartView} onClose={() => setCartView(false)}>
            <Cart />
          </Modal>

          <Toolbar disableGutters>
            {/* Logo */}
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontStyle: 'italic' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>GreaseNGrill</Link>
            </Typography>

            {/* Mobile Menu Icon */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            {/* Navbar links for Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" sx={{ fontSize: '16px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
              </Button>
              {localStorage.getItem('authToken') && (
                <Button color="inherit" sx={{ fontSize: '16px' }}>
                  <Link to="/myOrder" style={{ textDecoration: 'none', color: 'white' }}>My Orders</Link>
                </Button>
              )}
            </Box>

            {/* Cart and Auth buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!localStorage.getItem('authToken') ? (
                <>
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ mx: 1, color: 'white', borderColor: 'white' }}
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ mx: 1, color: 'white', borderColor: 'white' }}
                    component={Link}
                    to="/createuser"
                  >
                    SignUp
                  </Button>
                </>
              ) : (
                <>
                  {/* Cart Button */}
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{
                      mx: 2,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'white',
                      borderColor: 'white',
                    }}
                    onClick={handleCartClick}
                  >
                    🛒 Cart
                    <Badge
                      badgeContent={cartItems.length || 0}
                      color="error"
                      sx={{ ml: 1 }}
                    />
                  </Button>

                  {/* Logout Button */}
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      mx: 2,
                      color: 'white',
                      borderColor: 'white',
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        </MenuItem>
        {localStorage.getItem('authToken') && (
          <MenuItem onClick={handleMenuClose}>
            <Link to="/myOrder" style={{ textDecoration: 'none', color: 'inherit' }}>My Orders</Link>
          </MenuItem>
        )}
        {!localStorage.getItem('authToken') && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>Login</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/createuser" style={{ textDecoration: 'none', color: 'white' }}>SignUp</Link>
            </MenuItem>
          </>
        )}
        {localStorage.getItem('authToken') && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <span onClick={handleLogout}>Logout</span>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}
