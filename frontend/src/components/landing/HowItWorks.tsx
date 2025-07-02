import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { Restaurant, ShoppingCart, LocalDining } from "@mui/icons-material";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Restaurant sx={{ fontSize: 40 }} />,
    title: "Browse Menus",
    description:
      "Explore a wide variety of restaurants and dishes available in your area.",
    step: "01",
  },
  {
    icon: <ShoppingCart sx={{ fontSize: 40 }} />,
    title: "Place Your Order",
    description:
      "Select your favorite items, customize them, and proceed to checkout.",
    step: "02",
  },
  {
    icon: <LocalDining sx={{ fontSize: 40 }} />,
    title: "Enjoy Your Meal",
    description:
      "Sit back and relax while we deliver your delicious meal to your door.",
    step: "03",
  },
];

const HowItWorksSection = () => {
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
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6, color: "text.primary" }}
          >
            How It Works
          </Typography>
        </motion.div>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, marginLeft: 0 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  marginLeft: 100 * (index + 1),
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {step.step}
                  </Avatar>
                  <CardContent sx={{ pt: 0 }}>
                    <Box
                      sx={{
                        color: "primary.main",
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      gutterBottom
                      sx={{ color: "text.primary" }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      {step.description}
                    </Typography>
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

export default HowItWorksSection;
