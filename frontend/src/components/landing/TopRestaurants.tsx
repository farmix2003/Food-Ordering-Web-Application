import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  Chip,
} from "@mui/material";
import { Restaurant } from "@mui/icons-material";
import { motion } from "framer-motion";
import { getRestaurantForlandingPage } from "../../server/server";
import type { I18n } from "../../pages/Index";

interface Image{
  id:number;
  fileName:string;
  url:string;
}

interface Restaurant {
  id:number;
  name:string;
  images:Image[];
  address:{streetName:string, cityName:string};
  cuisineType:string
}

const TopRestaurants = ({t}:I18n) => {

  const [restaurants, setRestuarants] = useState<Restaurant[]>([])


    const getRestaurants = async() =>{
      const data = await getRestaurantForlandingPage()
      console.log(data)
      setRestuarants(data)
    }
    useEffect(() =>{
     getRestaurants() 
    },[])


  return (
    <Box sx={{ py: 8, backgroundColor: "white" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6, color: "text.primary" }}
          >
          {t("topRestaurants")}
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {restaurants.map((restaurant, index) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    width={"25rem"}
                    image={restaurant.images[0].url}
                    alt={restaurant.name}
                    sx={{
                      height:200,
                      width:"25rem",
                      objectFit:"cover"
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {restaurant.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {restaurant.address.cityName} • {restaurant.address.streetName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                        <Chip
                          key={restaurant.cuisineType}
                          label={restaurant.cuisineType}
                          size="small"
                          variant="outlined"
                        />
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Restaurant />}
                      sx={{ borderRadius: 2 }}
                    >
                      {t("viewMenu")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TopRestaurants;
