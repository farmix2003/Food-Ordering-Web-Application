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
import type { I18n } from "../../pages/Index";


const HowItWorksSection = ({t}:I18n) => {
  const steps = [
    {
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      title: t("menuTitle"),
      description:
        t("menuDesc"),
      step: "01",
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: t("shopping"),
      description:
       t("shoppingDesc"),
      step: "02",
    },
    {
      icon: <LocalDining sx={{ fontSize: 40 }} />,
      title: t("enjoy"),
      description:
        t("enjoyDesc"),
      step: "03",
    },
  ];
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
            {t("howItWorks")}
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
