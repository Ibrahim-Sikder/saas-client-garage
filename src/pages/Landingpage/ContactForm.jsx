"use client";

import { useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import { buttonStyle, inputStyle } from "../../utils/customStyle";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
const ContactForm = ({ language }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    garageName: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:7000/api/v1/contact",
        formData,
      );
      if (res?.data?.success) {
        toast.success(
          language === "ENG"
            ? "Thank you for contacting us. We will respond soon!"
            : "আমাদের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমরা শীঘ্রই উত্তর দেব!",
        );
      } else {
        toast.success(
          res?.data?.message ||
            (language === "ENG"
              ? "Something went wrong! Please try again later."
              : "কিছু সমস্যা হয়েছে! অনুগ্রহ করে পরে আবার চেষ্টা করুন।"),
        );
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        garageName: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        language === "ENG"
          ? "Something went wrong. Please try again."
          : "কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 6,
          background: alpha("#1e293b", 0.5),
          backdropFilter: "blur(20px)",
          border: `2px solid ${alpha("#ffffff", 0.2)}`,
          height: "100%",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#06b6d4" }}
        >
          💬{" "}
          {language === "ENG"
            ? "Send us a Message"
            : "আমাদের একটি বার্তা পাঠান"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: alpha("#ffffff", 0.8) }}
        >
          {language === "ENG"
            ? "Fill out the form below and our team will get back to you within 24 hours."
            : "নীচের ফর্মটি পূরণ করুন এবং আমাদের দল ২৪ ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করবে।"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label={language === "ENG" ? "Full Name" : "পূর্ণ নাম"}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              required
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label={language === "ENG" ? "Email Address" : "ইমেইল ঠিকানা"}
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              type="email"
              required
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label={language === "ENG" ? "Phone Number" : "ফোন নম্বর"}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              required
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label={language === "ENG" ? "Garage Name" : "গ্যারেজের নাম"}
              name="garageName"
              value={formData.garageName}
              onChange={handleChange}
              variant="outlined"
              required
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label={language === "ENG" ? "Message" : "বার্তা"}
              name="message"
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              required
              sx={inputStyle}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={buttonStyle}
              >
                🚀{" "}
                {submitting
                  ? language === "ENG"
                    ? "Sending..."
                    : "পাঠানো হচ্ছে..."
                  : language === "ENG"
                    ? "Send Message"
                    : "বার্তা পাঠান"}
              </Button>
            </motion.div>
          </Stack>
        </form>
      </Paper>
    </motion.div>
  );
};

export default ContactForm;
