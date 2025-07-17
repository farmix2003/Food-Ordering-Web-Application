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
import TopFoodsSection from "../components/landing/TopFoodsSection";


export interface I18n{
  t:(value:string) =>string
}

const Index = ({t}:I18n) => {
 


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <HeroSection t={t} />
        <SearchSection t={t} />
        <TopFoodsSection t={t} />
        <TopRestaurants t={t} />
        <MenuSection t={t} />
        <FeaturesSection t={t} />
        <HowItWorksSection t={t} />
        <AboutSection t={t} />
        <Footer t={t} />
        <BackToTop />
      </div>
    </ThemeProvider>
  );
};

export default Index;
