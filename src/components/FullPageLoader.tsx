// components/ui/FullPageLoader.tsx
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { LocalFlorist } from "@mui/icons-material";
import { motion } from "framer-motion";

type FullPageLoaderProps = {
  message?: string;
};

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = "Loading your farm data...",
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "background.default",
        zIndex: theme.zIndex.modal + 1,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress size={64} thickness={3} color="primary" />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalFlorist sx={{ color: "primary.main", fontSize: 28 }} />
          </Box>
        </Box>
      </motion.div>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default FullPageLoader;