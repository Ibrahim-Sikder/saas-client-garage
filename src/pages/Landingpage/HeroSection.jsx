"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import {
  Rocket,
  PlayArrow,
  Star,
  Verified,
  TrendingUp,
  Speed,
} from "@mui/icons-material";
import { motion, useScroll, useTransform } from "framer-motion";
import { FloatingParticles } from "./FloatingParticle";

/* eslint-disable react/prop-types */
export const HeroSection = ({ language }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 12, md: 0 },
      }}
    >
      <FloatingParticles />
      <motion.div style={{ y: y1 }}>
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)`,
            opacity: 0.1,
            animation: "spin 20s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      </motion.div>

      <motion.div style={{ y: y2 }}>
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `linear-gradient(45deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))`,
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 2, mt: { lg: 10 } }}
      >
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Chip
                    label={
                      language === "ENG"
                        ? "🏆 #1 Garage Management Platform"
                        : "🏆 #১ গ্যারেজ ম্যানেজমেন্ট প্ল্যাটফর্ম"
                    }
                    sx={{
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      px: { lg: 3 },
                      py: 1,
                      fontSize: "0.9rem",
                      boxShadow: `0 8px 25px rgba(6, 182, 212, 0.3)`,
                    }}
                  />
                </motion.div>
              </Stack>

              <Typography
                variant="h1"
                className="text-center lg:text-left"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "3rem", md: "5rem" },
                  lineHeight: 0.9,
                  mb: 4,
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-3px",
                }}
              >
                {language === "ENG" ? "Complete Garage" : "সম্পূর্ণ গ্যারেজ"}
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background:
                      "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {language === "ENG"
                    ? "Management Solution"
                    : "ব্যবস্থাপনা সমাধান"}
                </Box>
                <Box component="span" sx={{ fontSize: "0.5em", opacity: 0.8 }}>
                  {language === "ENG"
                    ? "From Customer to Payment"
                    : "গ্রাহক থেকে পেমেন্ট পর্যন্ত"}
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 6,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  maxWidth: 600,
                }}
              >
                {language === "ENG"
                  ? "Streamline your entire garage workflow with our AI-powered platform."
                  : "আমাদের এআই-চালিত প্ল্যাটফর্মের মাধ্যমে আপনার সম্পূর্ণ গ্যারেজ ওয়ার্কফ্লো সুসংহত করুন।"}{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "#06b6d4" }}
                >
                  {language === "ENG"
                    ? "Customer → Job Card → Quotation → Invoice → Money Receipt → Inventory → Accounts"
                    : "গ্রাহক → জব কার্ড → কোটেশন → ইনভয়েস → টাকা রসিদ → ইনভেন্টরি → অ্যাকাউন্টস"}
                </Box>{" "}
                {language === "ENG"
                  ? "- all in one seamless system."
                  : "- সবকিছু একটি নির্বিঘ্ন সিস্টেমে।"}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ mb: 6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Rocket />}
                    sx={{
                      width: { lg: 380 },
                      borderWidth: 3,
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      px: { lg: 5 },
                      py: { lg: 3 },
                      fontSize: { lg: "1.2rem" },
                      fontWeight: 700,
                      borderRadius: 4,
                      boxShadow: `0 15px 50px rgba(6, 182, 212, 0.4)`,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                        boxShadow: `0 20px 60px rgba(6, 182, 212, 0.6)`,
                      },
                    }}
                  >
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
                      width: 250,
                      display: "flex",
                      borderWidth: 3,
                      borderColor: "#06b6d4",
                      color: "#06b6d4",
                      px: 5,
                      py: 2.8,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      borderRadius: 4,
                      "&:hover": {
                        borderWidth: 3,
                        background: `linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)`,
                        boxShadow: `0 15px 40px rgba(6, 182, 212, 0.3)`,
                      },
                    }}
                  >
                    {language === "ENG" ? "Watch Demo" : "ডেমো দেখুন"}
                  </Button>
                </motion.div>
              </Stack>

              <Stack
                direction="row"
                spacing={6}
                alignItems="center"
                flexWrap="wrap"
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Stack direction="row" spacing={0.5}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          delay: star * 0.1,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Star sx={{ color: "#ffc107", fontSize: 24 }} />
                      </motion.div>
                    ))}
                  </Stack>
                  <Typography variant="body1" sx={{ ml: 2, fontWeight: 700 }}>
                    4.98/5 (2,500+ {language === "ENG" ? "reviews" : "রিভিউ"})
                  </Typography>
                </Box>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Chip
                    icon={<Verified />}
                    label={
                      language === "ENG"
                        ? "No Credit Card Required"
                        : "ক্রেডিট কার্ডের প্রয়োজন নেই"
                    }
                    sx={{
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "#10b981",
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} style={{ marginTop: 80 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Box sx={{ position: "relative", perspective: "1000px" }}>
                <motion.div
                  animate={{
                    rotateY: [0, 5, 0, -5, 0],
                    rotateX: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "rgba(30, 41, 59, 0.5)",
                      backdropFilter: "blur(20px)",
                      border: `2px solid rgba(255, 255, 255, 0.2)`,
                      boxShadow: `
                        0 25px 80px rgba(6, 182, 212, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        filter: "brightness(1.1) contrast(1.1)",
                        color: "#fff",
                        textAlign: "center",
                        p: 5,
                      }}
                    >
                      {language === "ENG"
                        ? "Garage Master Dashboard"
                        : "গ্যারেজ মাস্টার ড্যাশবোর্ড"}
                    </Box>
                  </Paper>
                </motion.div>

                {/* Floating Achievement Cards */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "180%",
                    right: "-15%",
                    zIndex: 3,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(30, 41, 59, 0.8)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid rgba(255, 255, 255, 0.3)`,
                      boxShadow: `0 20px 60px rgba(16, 185, 129, 0.3)`,
                      minWidth: 200,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                          borderRadius: "50%",
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TrendingUp sx={{ color: "#ffffff", fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: "#10b981" }}
                        >
                          +250% {language === "ENG" ? "Revenue" : "রেভিনিউ"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {language === "ENG" ? "Average Growth" : "গড় বৃদ্ধি"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 12, 0],
                    rotate: [0, -1, 0, 1, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  style={{
                    position: "absolute",
                    bottom: "180%",
                    left: { sm: "-80%", lg: "-20%" },
                    zIndex: 3,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(30, 41, 59, 0.8)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid rgba(255, 255, 255, 0.3)`,
                      boxShadow: `0 20px 60px rgba(59, 130, 246, 0.3)`,
                      minWidth: 180,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          background:
                            "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                          borderRadius: "50%",
                          p: 1.5,
                        }}
                      >
                        <Speed sx={{ color: "#ffffff", fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: "#3b82f6" }}
                        >
                          85% {language === "ENG" ? "Faster" : "দ্রুততর"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {language === "ENG"
                            ? "Processing Time"
                            : "প্রসেসিং সময়"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
