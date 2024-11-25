import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/ContextReducer.js';
import MyOrder from './screens/MyOrder.js';
import { CssBaseline, Box } from '@mui/material';
import Cart from './screens/Cart.js';
function App() {
  return (
    <CartProvider>
      <Router>
        {/* Applying CssBaseline to standardize the appearance */}
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createuser" element={<Signup />} />
            <Route path="/myOrder" element={<MyOrder />} />
            <Route path="/myCart" element={<Cart />} />
          </Routes>
        </Box>
      </Router>
    </CartProvider>
  );
}

export default App;
