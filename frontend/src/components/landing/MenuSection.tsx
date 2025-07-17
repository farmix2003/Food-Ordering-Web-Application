import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { motion } from "framer-motion";
import { getMenusForLandingPage } from "../../server/server";
import type { I18n } from "../../pages/Index";

interface Image {
  id:number;
  fileName:string;
  url:string;
}

interface Menu {
  id:number
   categoryName:string;
   description:string;
   estrasList:{id:number, name:string; price:number};
   foodName:string;
   images:Image[]
   price:number;
}



const menuItems = {
  Breakfast: [
    {
      id: 1,
      name: "Pancakes Stack",
      price: "$6.99",
      image:
        "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=200&fit=crop",
      rating: 4.5,
      description: "Fluffy pancakes with maple syrup",
    },
    {
      id: 2,
      name: "Avocado Toast",
      price: "$5.99",
      image:
        "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop",
      rating: 4.3,
      description: "Fresh avocado on sourdough bread",
    },
  ],
  Lunch: [
    {
      id: 3,
      name: "Grilled Chicken",
      price: "$12.99",
      image:
        "https://images.unsplash.com/photo-1532636875304-0c89119d9b46?w=300&h=200&fit=crop",
      rating: 4.6,
      description: "Tender grilled chicken with vegetables",
    },
    {
      id: 4,
      name: "Fish Tacos",
      price: "$10.99",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      rating: 4.4,
      description: "Fresh fish tacos with lime",
    },
  ],
  Dinner: [
    {
      id: 5,
      name: "Steak & Potatoes",
      price: "$18.99",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
      rating: 4.8,
      description: "Premium beef steak with roasted potatoes",
    },
    {
      id: 6,
      name: "Salmon Fillet",
      price: "$16.99",
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop",
      rating: 4.7,
      description: "Grilled salmon with herbs",
    },
  ],
  Snacks: [
    {
      id: 7,
      name: "Nachos",
      price: "$7.99",
      image:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop",
      rating: 4.2,
      description: "Crispy nachos with cheese and jalapeños",
    },
    {
      id: 8,
      name: "Wings",
      price: "$9.99",
      image:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&h=200&fit=crop",
      rating: 4.5,
      description: "Spicy buffalo wings",
    },
  ],
  Drinks: [
    {
      id: 9,
      name: "Fresh Juice",
      price: "$3.99",
      image:
        "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&h=200&fit=crop",
      rating: 4.1,
      description: "Freshly squeezed orange juice",
    },
    {
      id: 10,
      name: "Smoothie Bowl",
      price: "$5.99",
      image:
        "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300&h=200&fit=crop",
      rating: 4.4,
      description: "Healthy smoothie bowl with berries",
    },
  ],
};

const MenuSection = ({t}:I18n) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
 const [menus, setMenus] = useState<Menu[]>([])
 
 const getMenus = async() =>{
  const data = await getMenusForLandingPage();
  console.log(data)
  setMenus(data)
}
 
useEffect(() =>{
  getMenus()
},[])
console.log("Menus",menus)
 
 const handleCategoryChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedCategory(newValue);
  };

  const uniqueCategories = Array.from(new Set(menus.map(menu => menu.categoryName)));
  const menuCategories = ["All", ...uniqueCategories];
  
  const currentMenuItems: Menu[] =
    menuCategories[selectedCategory] === "All"
      ? menus.slice(0, 6)
      : menus.filter(menu => menu.categoryName === menuCategories[selectedCategory]);
  
  return (
    <Box sx={{ py: 8, backgroundColor: "background.default" }}>
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
            {t("exploreMenu")}
          </Typography>
        </motion.div>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontSize: "1.1rem",
                fontWeight: 600,
              },
            }}
          >
            {menuCategories.map((category,index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={4}>
          {currentMenuItems?.map((item, index) => (
            <Grid key={item.id}>
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
  image={item.images[0].url}
  alt={item.images[0].fileName}
  sx={{
    height: 200,
    width: "20rem",
    objectFit: "cover",
  }}
/>

                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.foodName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {item.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {item.price}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddShoppingCart />}
                        sx={{ borderRadius: 2 }}
                      >
                       {t("addToCart")}
                      </Button>
                    </Box>
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

export default MenuSection;
