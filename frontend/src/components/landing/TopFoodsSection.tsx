import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  useTheme,
} from "@mui/material";
import {
  AddShoppingCart,
  CurrencyLira,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { getPoplularFoods } from "../../server/server";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const topFoods = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: "$12.99",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Chicken Burger",
    price: "$8.99",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    rating: 4.3,
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: "$7.99",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Sushi Roll",
    price: "$15.99",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Pasta Carbonara",
    price: "$11.99",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
    rating: 4.4,
  },
];

interface Image {
  id:number;
  url:string;
}

interface MenuItem{
  id:number;
  available:boolean;
  foodName:string;
  images:Image[];
  restauantId:number;
  categoryName:string;
  price:number
}

const TopFoodsSection = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const navigate = useNavigate()

  const getPopularMenuItems = async() =>{
     const data = await getPoplularFoods()
     console.log(data.data)
     setMenuItems(data.data)
  }

  useEffect(()=>{
    getPopularMenuItems()
  },[])


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
            🔥 Trending Foods
          </Typography>
        </motion.div>

        <Box sx={{ display: "flex", overflowX: "auto", gap: 3, pb: 2 }}>
          {menuItems.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  minWidth: 280,
                  maxWidth: 280,
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[10],
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={food.images[0].url}
                  alt={food.foodName}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {food.foodName}
                  </Typography>
                    <Typography variant="body2">
                      {food.categoryName}
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
                     <CurrencyLira className="w-4 h-4" /> {food.price}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCart />}
                      sx={{ borderRadius: 2 }}
                      onClick={()=>navigate('/login')}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TopFoodsSection;
