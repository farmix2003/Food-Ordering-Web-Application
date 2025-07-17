import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Divider,
  ThemeProvider,
} from "@mui/material";
import {
  Telegram,
  GitHub,
  LinkedIn,
  Home,
  Info,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { I18n } from "../pages/Index";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme/theme";

const Footer = ({t}:I18n) => {
  const navigate = useNavigate()
  return (
    <ThemeProvider theme={theme}>
    <Box
    sx={{
      bgcolor: "primary.main",
      color: "white",
      py: 6,
      mt: 8,
    }}
    
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Eat Ease
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('footerDesc')}
              </Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" gutterBottom>
                {t("links")}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Home fontSize="small" />
                  <Typography variant="body2" className="cursor-pointer">Home</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Info fontSize="small" />
                  <Typography variant="body2" className="cursor-pointer">About</Typography>
                </Box>
               
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" gutterBottom>
                {t("connectUs")}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Telegram />
                </IconButton>
                <IconButton
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <GitHub onClick={()=>navigate("")} />
                </IconButton>
                <IconButton
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          >
          <Typography variant="body2" align="center">
            © 2025 Eat Ease. Built with ❤️ for a university graduation project.
          </Typography>
        </motion.div>
      </Container>
    </Box>
          </ThemeProvider>
  );
};

export default Footer;
