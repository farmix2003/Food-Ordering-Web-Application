import { useState, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        color="primary"
        size="large"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          "&:hover": {
            transform: "scale(1.1)",
          },
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export default BackToTop;
