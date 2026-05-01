/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { People, DirectionsCar, Shield, TrendingUp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimateCounter";

/* eslint-disable react/prop-types */
export const StatsSection = ({ language }) => {
  const stats = [
    {
      value: 2500,
      label: language === "ENG" ? "Happy Clients" : "সন্তুষ্ট ক্লায়েন্ট",
      suffix: "+",
      icon: <People />,
    },
    {
      value: 150000,
      label: language === "ENG" ? "Vehicles Managed" : "পরিচালিত যানবাহন",
      suffix: "+",
      icon: <DirectionsCar />,
    },
    {
      value: 99.99,
      label: language === "ENG" ? "Uptime Guarantee" : "আপটাইম গ্যারান্টি",
      suffix: "%",
      icon: <Shield />,
    },
    {
      value: 85,
      label: language === "ENG" ? "Average Growth" : "গড় বৃদ্ধি",
      suffix: "%",
      icon: <TrendingUp />,
    },
  ];

  return (
    <Box
      sx={{
        py: 12,
        background: `
          linear-gradient(135deg, rgba(6, 182, 212, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)
        `,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🚀{" "}
              {language === "ENG"
                ? "Proven Results That Speak for Themselves"
                : "প্রমাণিত ফলাফল যা নিজেই কথা বলে"}
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              {language === "ENG"
                ? "Join thousands of successful garage owners who've transformed their business"
                : "হাজার হাজার সফল গ্যারেজ মালিকদের সাথে যোগ দিন যারা তাদের ব্যবসা রূপান্তরিত করেছেন"}
            </Typography>
          </motion.div>
        </Box>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid rgba(6, 182, 212, 0.2)`,
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: `0 25px 80px rgba(6, 182, 212, 0.2)`,
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
                      height: 4,
                      background: `linear-gradient(90deg, #06b6d4, rgba(6, 182, 212, 0.5))`,
                      opacity: 0.7,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, #06b6d4, rgba(6, 182, 212, 0.7))`,
                        borderRadius: "50%",
                        p: 2,
                        display: "inline-flex",
                        mb: 3,
                        boxShadow: `0 8px 25px rgba(6, 182, 212, 0.3)`,
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: { color: "#ffffff", fontSize: 32 },
                      })}
                    </Box>
                  </motion.div>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontWeight: 600,
                      mt: 1,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
