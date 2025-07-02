import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                About Eat Ease
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: "1.2rem",
                  lineHeight: 1.7,
                  color: "text.secondary",
                }}
              >
                Eat Ease is a food delivery web app built for convenience and
                speed. Developed using Java Spring Boot (backend) and React +
                TypeScript (frontend), it helps users order from local
                restaurants effortlessly.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: "1.2rem",
                  lineHeight: 1.7,
                  color: "text.secondary",
                }}
              >
                Our platform connects hungry customers with their favorite local
                restaurants, making food ordering simple, fast, and enjoyable
                for busy students and families.
              </Typography>
              <Card
                sx={{
                  mt: 4,
                  background:
                    "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🎓 Final Year Graduation Project
                  </Typography>
                  <Typography variant="body2">
                    This project represents the culmination of years of learning
                    in software development, combining modern web technologies
                    to solve real-world problems.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Happy chef preparing food"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
