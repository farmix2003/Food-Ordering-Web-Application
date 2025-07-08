import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../theme/theme";
import HeroSection from "../components/landing/HeroSection";
import SearchSection from "../components/landing/SearchSection";
import TopRestaurants from "../components/landing/TopRestaurants";
import MenuSection from "../components/landing/MenuSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorks";
import AboutSection from "../components/landing/AboutSection";
import Footer from "../components/Footer";
import BackToTop from "../components/landing/BacToTop";
const Index = () => {
 


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <HeroSection />
        <SearchSection />
        {/* <TopFoodsSection /> */}
        <TopRestaurants />
        <MenuSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <Footer />
        <BackToTop />
      </div>
    </ThemeProvider>
  );
};

export default Index;
