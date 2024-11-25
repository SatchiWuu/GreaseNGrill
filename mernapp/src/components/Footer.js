import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, my: 4, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            {/* You can add your logo or icon here if needed */}
            <span style={{ marginRight: '8px', fontSize: '1.2rem' }}></span>
          </Link>
          <Typography variant="body2" color="textSecondary">
            © 2024 GreasenGrill, Inc
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
