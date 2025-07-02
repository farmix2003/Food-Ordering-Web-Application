import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { motion } from "framer-motion";

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    "Veg",
    "Non-Veg",
    "Fast Food",
    "Italian",
    "Chinese",
    "Rating 4+",
  ];

  const handleFilterClick = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <Box sx={{ py: 6, backgroundColor: "background.paper", borderRadius: 2 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 4, color: "text.primary" }}
          >
            What are you craving today?
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 4,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for dishes, cuisines, or restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "1.1rem",
                },
              }}
            />
          </Paper>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FilterList sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Filters:
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                clickable
                color={selectedFilters.includes(filter) ? "primary" : "default"}
                onClick={() => handleFilterClick(filter)}
                sx={{
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SearchSection;
