/* eslint-disable react/prop-types */
"use client";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import { ArrowForward, TaskAlt } from "@mui/icons-material";
import { motion } from "framer-motion";

const WorkflowSection = ({ workflowSteps, language }) => {
  return (
    <Box id="workflow" sx={{ py: 15 }}>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, #06b6d4, ${alpha(
                      "#06b6d4",
                      0.7,
                    )})`,
                    borderRadius: 3,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TaskAlt sx={{ fontSize: 32 }} />
                </Box>
                {language === "ENG"
                  ? "Complete Workflow"
                  : "সম্পূর্ণ ওয়ার্কফ্লো"}
              </Box>
              <Box component="span" sx={{ display: "block" }}>
                {language === "ENG"
                  ? "From Customer to Payment"
                  : "গ্রাহক থেকে পেমেন্ট পর্যন্ত"}
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
                ? "Our streamlined 9-step process ensures nothing falls through the cracks. Every step is automated, tracked, and optimized for maximum efficiency."
                : "আমাদের সুবিন্যস্ত ৯-ধাপ প্রক্রিয়া নিশ্চিত করে যে কিছুই ফাঁক দিয়ে পড়ে না। প্রতিটি ধাপ স্বয়ংক্রিয়, ট্র্যাক করা এবং সর্বোচ্চ দক্ষতার জন্য অপ্টিমাইজ করা হয়েছে।"}
            </Typography>
          </motion.div>
        </Box>
        <Grid container spacing={2}>
          {workflowSteps.map((step, index) => (
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
                    border: `2px solid ${alpha("#06b6d4", 0.2)}`,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: `0 30px 100px ${alpha("#06b6d4", 0.2)}`,
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
                      background: `linear-gradient(90deg, #06b6d4, ${alpha(
                        "#06b6d4",
                        0.5,
                      )})`,
                      opacity: 0.7,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, #06b6d4, ${alpha(
                            "#06b6d4",
                            0.7,
                          )})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                          boxShadow: `0 8px 25px ${alpha("#06b6d4", 0.3)}`,
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{ color: "#ffffff" }}
                        >
                          {step.step}
                        </Typography>
                      </Box>
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
                            background: `linear-gradient(135deg, #06b6d4, ${alpha(
                              "#06b6d4",
                              0.7,
                            )})`,
                            borderRadius: 3,
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {step.icon}
                        </Box>
                      </motion.div>
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        background: `linear-gradient(135deg, #06b6d4, ${alpha(
                          "#06b6d4",
                          0.7,
                        )})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha("#ffffff", 0.8),
                        lineHeight: 1.7,
                        fontSize: "1.1rem",
                      }}
                    >
                      {step.description}
                    </Typography>
                    {index < workflowSteps.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -20,
                          right: 20,
                          zIndex: 2,
                        }}
                      >
                        <motion.div
                          animate={{
                            x: [0, 10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowForward
                            sx={{
                              color: "#06b6d4",
                              fontSize: 32,
                              background: alpha("#ffffff", 0.9),
                              borderRadius: "50%",
                              p: 1,
                              boxShadow: `0 4px 15px ${alpha("#06b6d4", 0.3)}`,
                            }}
                          />
                        </motion.div>
                      </Box>
                    )}
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

export default WorkflowSection;
