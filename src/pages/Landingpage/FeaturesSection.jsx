"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { motion } from "framer-motion";

const FeaturesSection = ({ features, language }) => {
  return (
    <Box
      id="features"
      sx={{
        py: 15,
        background: `
          linear-gradient(135deg, ${alpha("#06b6d4", 0.02)} 0%, ${alpha("#3b82f6", 0.02)} 100%),
          radial-gradient(circle at 30% 70%, ${alpha("#8b5cf6", 0.02)} 0%, transparent 50%)
        `,
      }}
    >
      <Container maxWidth="lg">
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
              🚀{" "}
              {language === "ENG" ? "Powerful Features" : "শক্তিশালী বৈশিষ্ট্য"}
              <Box component="span" sx={{ display: "block" }}>
                {language === "ENG"
                  ? "Built for Success"
                  : "সাফল্যের জন্য নির্মিত"}
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: alpha("#ffffff", 0.8),
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {language === "ENG"
                ? "Everything you need to run a modern, efficient garage business. From customer management to financial reporting, we've got you covered."
                : "একটি আধুনিক, দক্ষ গ্যারেজ ব্যবসা চালানোর জন্য আপনার যা কিছু প্রয়োজন। গ্রাহক ব্যবস্থাপনা থেকে আর্থিক প্রতিবেদন পর্যন্ত, আমরা সবকিছু কভার করেছি।"}
            </Typography>
          </motion.div>
        </Box>
        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -15,
                  rotateX: 5,
                  rotateY: 5,
                }}
                style={{ perspective: "1000px" }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 4,
                    borderRadius: 6,
                    background: alpha("#1e293b", 0.5),
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${alpha("#ffffff", 0.2)}`,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: `0 30px 100px ${alpha("#06b6d4", 0.2)}`,
                      "&::before": {
                        opacity: 1,
                      },
                      "&::after": {
                        transform: "translateX(100%)",
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: feature.gradient,
                      opacity: 0.7,
                      transition: "opacity 0.3s ease",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      transition: "transform 0.6s ease",
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: feature.gradient,
                            mr: 3,
                            boxShadow: `0 15px 40px ${alpha("#06b6d4", 0.3)}`,
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              inset: 2,
                              borderRadius: 3,
                              background: alpha("#ffffff", 0.1),
                            },
                          }}
                        >
                          {React.cloneElement(feature.icon, {
                            sx: {
                              color: "#ffffff",
                              fontSize: 36,
                              zIndex: 1,
                              position: "relative",
                            },
                          })}
                        </Box>
                      </motion.div>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                          background: feature.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        lineHeight: 1.7,
                        fontSize: "1.1rem",
                        color: alpha("#ffffff", 0.8),
                      }}
                    >
                      {feature.description}
                    </Typography>
                    <List disablePadding>
                      {feature.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: itemIndex * 0.1 }}
                        >
                          <ListItem
                            disableGutters
                            sx={{
                              py: 1,
                              "&:hover": {
                                transform: "translateX(10px)",
                                "& .MuiListItemIcon-root": {
                                  transform: "scale(1.2)",
                                },
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Check
                                  sx={{
                                    color: "#06b6d4",
                                    fontSize: 20,
                                    filter: `drop-shadow(0 2px 4px ${alpha("#06b6d4", 0.3)})`,
                                  }}
                                />
                              </motion.div>
                            </ListItemIcon>
                            <ListItemText
                              primary={item}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 600,
                                fontSize: "1rem",
                                color: "#fff",
                              }}
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
