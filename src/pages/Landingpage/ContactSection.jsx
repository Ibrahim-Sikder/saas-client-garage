"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Stack,
  alpha,
} from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

const ContactSection = ({ language }) => {
  const contactInfo = [
    {
      icon: <Phone />,
      title: language === "ENG" ? "Call Us" : "কল করুন",
      content: "+880 167 0405 744",
      description:
        language === "ENG"
          ? "Saturday - Thursday - 9 AM - 7PM"
          : "শনি-বৃহস্পতি - সকাল ৯টা - সন্ধ্যা ৭টা",
      color: "#06b6d4",
    },
    {
      icon: <Email />,
      title: language === "ENG" ? "Email Us" : "ইমেল করুন",
      content: "support@softypy.com",
      description:
        language === "ENG"
          ? "We'll respond within 24 hours"
          : "আমরা ২৪ ঘন্টার মধ্যে উত্তর দেব",
      color: "#3b82f6",
    },
    {
      icon: <LocationOn />,
      title: language === "ENG" ? "Visit Us" : "আমাদের দেখুন",
      content:
        language === "ENG"
          ? " Ka-86/1, Al -Hera Tower"
          : " কএ-৮৬/১, আল-হেরা টাওয়ার",
      description:
        language === "ENG"
          ? "Level -1 (lift-1), Kuratoli, Khilkhet, Dhaka - 1229"
          : "লেভেল -১ (লিফট-১), কুড়াটোলি, খিলক্ষেত, ঢাকা - ১২২৯",
      color: "#f59e0b",
    },
  ];

  return (
    <Box
      id="contact"
      sx={{
        py: 15,
        background: `
          linear-gradient(135deg, ${alpha("#06b6d4", 0.03)} 0%, ${alpha(
            "#3b82f6",
            0.03,
          )} 100%)
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
              📞 {language === "ENG" ? "Get In Touch" : "যোগাযোগ করুন"}
              <Box component="span" sx={{ display: "block" }}>
                {language === "ENG"
                  ? "Let's Transform Your Garage"
                  : "আপনার গ্যারেজ রূপান্তর করুন"}
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
                ? "Ready to revolutionize your garage business? Contact our experts today for a personalized demo and consultation."
                : "আপনার গ্যারেজ ব্যবসা বিপ্লব করতে প্রস্তুত? ব্যক্তিগতকৃত ডেমো এবং পরামর্শের জন্য আজই আমাদের বিশেষজ্ঞদের সাথে যোগাযোগ করুন।"}
            </Typography>
          </motion.div>
        </Box>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <ContactForm language={language} />
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Stack spacing={4}>
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: alpha("#1e293b", 0.5),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(contact.color, 0.2)}`,
                        "&:hover": {
                          boxShadow: `0 15px 40px ${alpha(contact.color, 0.2)}`,
                          borderColor: alpha(contact.color, 0.4),
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box
                          sx={{
                            background: `linear-gradient(135deg, ${
                              contact.color
                            }, ${alpha(contact.color, 0.7)})`,
                            borderRadius: "50%",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {React.cloneElement(contact.icon, {
                            sx: { color: "#ffffff", fontSize: 28 },
                          })}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ color: "#ffffff" }}
                          >
                            {contact.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: contact.color }}
                            gutterBottom
                          >
                            {contact.content}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: alpha("#ffffff", 0.8) }}
                          >
                            {contact.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      🎯{" "}
                      {language === "ENG"
                        ? "Ready to Get Started?"
                        : "শুরু করতে প্রস্তুত?"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                      {language === "ENG"
                        ? "Book a free 30-minute consultation with our garage management experts."
                        : "আমাদের গ্যারেজ ব্যবস্থাপনা বিশেষজ্ঞদের সাথে একটি বিনামূল্যে ৩০ মিনিটের পরামর্শ বুক করুন।"}
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          background: "#ffffff",
                          color: "#06b6d4",
                          fontWeight: 700,
                          px: 4,
                          py: 2,
                          borderRadius: 3,
                          "&:hover": {
                            background: alpha("#ffffff", 0.9),
                          },
                        }}
                      >
                        📅{" "}
                        {language === "ENG"
                          ? "Schedule Free Demo"
                          : "বিনামূল্যে ডেমো নির্ধারণ করুন"}
                      </Button>
                    </motion.div>
                  </Paper>
                </motion.div>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;
