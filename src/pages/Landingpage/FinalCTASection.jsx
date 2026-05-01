"use client";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Stack,
  alpha,
} from "@mui/material";
import {
  PlayArrow,
  Security,
  Support,
  CloudSync,
  Rocket,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { FloatingParticles } from "./FloatingParticle";

/* eslint-disable react/prop-types */
const FinalCTASection = ({ language }) => {
  return (
    <Box
      sx={{
        py: 15,
        background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingParticles />
      <Container
        maxWidth="md"
        sx={{ textAlign: "center", position: "relative", zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: "3rem", md: "5rem" },
                lineHeight: 0.9,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              🚀{" "}
              {language === "ENG"
                ? "Ready to Transform"
                : "রূপান্তর করতে প্রস্তুত"}
              <Box component="span" sx={{ display: "block" }}>
                {language === "ENG"
                  ? "Your Garage Business?"
                  : "আপনার গ্যারেজ ব্যবসা?"}
              </Box>
            </Typography>
          </motion.div>
          <Typography
            variant="h5"
            sx={{
              mb: 8,
              opacity: 0.95,
              lineHeight: 1.6,
              maxWidth: 800,
              mx: "auto",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {language === "ENG" ? "Join over " : "যোগ দিন "}
            <strong>
              2,500{" "}
              {language === "ENG"
                ? "successful garage owners"
                : "সফল গ্যারেজ মালিকদের"}
            </strong>
            {language === "ENG"
              ? " who have revolutionized their business with our complete workflow solution. Start your transformation today with our "
              : " যারা আমাদের সম্পূর্ণ ওয়ার্কফ্লো সমাধানের মাধ্যমে তাদের ব্যবসা বিপ্লব করেছেন। আমাদের "}
            <strong>
              {language === "ENG"
                ? "30-day FREE trial"
                : "৩০-দিনের বিনামূল্যে ট্রায়াল"}
            </strong>
            {language === "ENG"
              ? " - no credit card required!"
              : " দিয়ে আজই আপনার রূপান্তর শুরু করুন - ক্রেডিট কার্ডের প্রয়োজন নেই!"}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Rocket />}
                sx={{
                  background: "#ffffff",
                  color: "#06b6d4",
                  px: 8,
                  py: 3,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  "&:hover": {
                    background: alpha("#ffffff", 0.95),
                    boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
                  },
                }}
              >
                🎉{" "}
                {language === "ENG"
                  ? "START FREE 30-DAY TRIAL"
                  : "ফ্রি ৩০-দিনের ট্রায়াল শুরু করুন"}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  borderWidth: 3,
                  borderColor: "#ffffff",
                  color: "#ffffff",
                  px: 8,
                  py: 3,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  borderRadius: 4,
                  "&:hover": {
                    borderWidth: 3,
                    background: alpha("#ffffff", 0.1),
                    boxShadow: "0 15px 40px rgba(255,255,255,0.2)",
                  },
                }}
              >
                🎬 {language === "ENG" ? "Watch Live Demo" : "লাইভ ডেমো দেখুন"}
              </Button>
            </motion.div>
          </Stack>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ opacity: 0.9 }}
          >
            <Grid item xs={12} sm={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Security sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {language === "ENG"
                      ? "Enterprise Security"
                      : "এন্টারপ্রাইজ নিরাপত্তা"}
                  </Typography>
                  <Typography variant="body2">
                    {language === "ENG"
                      ? "Bank-level encryption"
                      : "ব্যাংক-স্তরের এনক্রিপশন"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Support sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {language === "ENG"
                      ? "24/7 VIP Support"
                      : "২৪/৭ ভিআইপি সমর্থন"}
                  </Typography>
                  <Typography variant="body2">
                    {language === "ENG"
                      ? "Dedicated success team"
                      : "নিবেদিত সাফল্য দল"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <CloudSync sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {language === "ENG" ? "99.99% Uptime" : "৯৯.৯৯% আপটাইম"}
                  </Typography>
                  <Typography variant="body2">
                    {language === "ENG" ? "Always available" : "সর্বদা উপলব্ধ"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FinalCTASection;
