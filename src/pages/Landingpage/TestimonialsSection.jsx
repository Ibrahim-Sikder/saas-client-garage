/* eslint-disable react/prop-types */
"use client";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Paper,
  Avatar,
  alpha,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { FloatingParticles } from "./FloatingParticle";

const TestimonialsSection = ({ testimonials, language }) => {
  return (
    <Box
      id="testimonials"
      sx={{
        py: 15,
        background: `
          linear-gradient(135deg, ${alpha("#06b6d4", 0.05)} 0%, ${alpha("#3b82f6", 0.05)} 100%),
          radial-gradient(circle at 30% 70%, ${alpha("#8b5cf6", 0.03)} 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, ${alpha("#f59e0b", 0.03)} 0%, transparent 50%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingParticles />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 4,
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              😊 {language === "ENG" ? "Happy Clients" : "সন্তুষ্ট ক্লায়েন্ট"}
              <Box component="span" sx={{ display: "block" }}>
                {language === "ENG" ? "Success Stories" : "সাফল্যের গল্প"}
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: alpha("#ffffff", 0.8),
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              {language === "ENG"
                ? "Discover how garage owners worldwide are achieving extraordinary results and transforming their businesses with our complete workflow solution."
                : "আবিষ্কার করুন কিভাবে বিশ্বব্যাপী গ্যারেজ মালিকরা আমাদের সম্পূর্ণ ওয়ার্কফ্লো সমাধানের সাথে অসাধারণ ফলাফল অর্জন করছেন এবং তাদের ব্যবসা রূপান্তরিত করছেন।"}
            </Typography>
          </motion.div>
        </Box>
        <Grid container spacing={6}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateY: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{
                  y: -20,
                  rotateY: 5,
                  scale: 1.02,
                }}
                style={{ perspective: "1000px" }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 5,
                    borderRadius: 6,
                    background: alpha("#1e293b", 0.5),
                    backdropFilter: "blur(20px)",
                    border: `2px solid ${alpha("#ffffff", 0.2)}`,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: `0 40px 120px ${alpha("#06b6d4", 0.2)}`,
                      "&::before": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 6,
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      opacity: 0.8,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  <Box sx={{ position: "absolute", top: 20, right: 20 }}>
                    <Chip
                      label={testimonial.badge}
                      sx={{
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          delay: star * 0.1,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 3,
                        }}
                      >
                        <Star sx={{ color: "#ffc107", fontSize: 28 }} />
                      </motion.div>
                    ))}
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      fontSize: "1.1rem",
                      position: "relative",
                      color: alpha("#ffffff", 0.9),
                    }}
                  >
                    {testimonial.content}
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: alpha("#10b981", 0.1),
                        border: `1px solid ${alpha("#10b981", 0.2)}`,
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          color: "#10b981",
                          textAlign: "center",
                        }}
                      >
                        {testimonial.revenue}{" "}
                        {language === "ENG"
                          ? "Revenue Growth"
                          : "রাজস্ব বৃদ্ধি"}
                      </Typography>
                    </Paper>
                  </Box>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Avatar
                        src={testimonial.avatar}
                        sx={{
                          width: 70,
                          height: 70,
                          border: `3px solid #06b6d4`,
                          boxShadow: `0 8px 25px ${alpha("#06b6d4", 0.3)}`,
                        }}
                      />
                    </motion.div>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          background:
                            "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha("#ffffff", 0.8), fontWeight: 600 }}
                      >
                        {testimonial.role}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: alpha("#ffffff", 0.6) }}
                      >
                        {testimonial.company}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
