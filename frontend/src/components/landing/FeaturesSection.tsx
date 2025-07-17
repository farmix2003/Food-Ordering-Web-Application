import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { DeliveryDining, AttachMoney, PhoneAndroid } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { I18n } from "../../pages/Index";


const FeaturesSection = ({t}:I18n) => {
  const theme = useTheme();
  
  const features = [
    {
      icon: <DeliveryDining sx={{ fontSize: 60 }} />,
      title: t("fast"),
      description:
        t("deliveryDesc"),
    },
    {
      icon: <AttachMoney sx={{ fontSize: 60 }} />,
      title: t("price"),
      description:
        t("priceDesc"),
    },
    {
      icon: <PhoneAndroid sx={{ fontSize: 60 }} />,
      title: t("interface"),
      description:
        t("interfaceDesc")
    },
  ];
  return (
    <Box sx={{ py: 8, backgroundColor: "background.default", px: 0, m: 0 }}>
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
            {t("why")}
          </Typography>
        </motion.div>

        <Grid
          container
          spacing={2}
          display={"flex"}
          flexDirection={"row"}
          justifyContent="center"
        >
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: "100%",
                    width: "25rem",
                    textAlign: "center",
                    p: 2,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        color: "primary.main",
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      gutterBottom
                      sx={{ color: "text.primary" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      {feature.description}
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

export default FeaturesSection;
