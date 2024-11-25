import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Typography, Button, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foodData", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
      }

      const data = await response.json();

      // Check response structure
      if (Array.isArray(data) && data.length >= 2) {
        setFoodItem(data[0]); // First array is food items
        setFoodCat(data[1]); // Second array is categories
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching data from the backend:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Navbar />

      {/* Carousel */}
      <Box sx={{ position: 'relative' }}>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {/* Search Bar on Top */}
            <Box sx={{ position: 'absolute', zIndex: 10, top: '20%', width: '100%' }}>
              <form className="d-flex justify-content-center">
                <TextField
                  variant="outlined"
                  label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    margin: 'auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                />
              </form>
            </Box>
            
            {/* Carousel Items */}
            <div className="carousel-item active">
              <img
                src="https://i.imgur.com/CUG0Aof.jpeg"
                className="d-block w-100"
                alt="Slide 1"
                style={{ filter: 'brightness(30%)', objectFit: 'cover', height: '500px' }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://www.shutterstock.com/image-photo/table-scene-variety-delicious-foods-600nw-2274282793.jpg"
                className="d-block w-100"
                alt="Slide 2"
                style={{ filter: 'brightness(30%)', objectFit: 'cover', height: '500px' }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/fe/6f/dd/get-a-loaf-of-the-flamethrower.jpg?w=600&h=-1&s=1"
                className="d-block w-100"
                alt="Slide 3"
                style={{ filter: 'brightness(30%)', objectFit: 'cover', height: '500px' }}
              />
            </div>
          </div>
          {/* Carousel Controls */}
          <Button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </Button>
          <Button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </Button>
        </div>
      </Box>

      {/* Category Sections */}
      <Container sx={{ paddingTop: 4 }}>
        {loading ? (
          <Typography>Loading categories...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : foodCat.length === 0 ? (
          <Typography>No categories found</Typography>
        ) : (
          foodCat.map((category, index) => (
            <Box key={index} sx={{ marginBottom: 4 }}>
              {/* Category Title */}
              <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                {category.CategoryName}
              </Typography>
              <Grid container spacing={3}>
                {/* Food Items */}
                {Array.isArray(foodItem) && foodItem.length > 0 ? (
                  foodItem
                    .filter(
                      (item) =>
                        item.CategoryName === category.CategoryName &&
                        item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((filteredItem) => (
                      <Grid item key={filteredItem._id} xs={12} sm={6} md={4} lg={3}>
                        <Card
                          foodItem={filteredItem}
                          options={filteredItem.options && filteredItem.options[0]}
                        />
                      </Grid>
                    ))
                ) : (
                  <Typography>No items found for this category</Typography>
                )}
              </Grid>
            </Box>
          ))
        )}
      </Container>

      <Footer />
    </div>
  );
}
