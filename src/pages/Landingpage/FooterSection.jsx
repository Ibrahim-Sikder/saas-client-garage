/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  Divider,
  alpha,
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";
import { motion } from "framer-motion";

/* eslint-disable react/prop-types */
export const FooterSection = ({ language }) => {
  const footerSections = [
    {
      title: language === "ENG" ? "Product" : "পণ্য",
      items:
        language === "ENG"
          ? [
              "🚀 Features",
              "🔄 Workflow",
              "💎 Pricing",
              "🎬 Demo",
              "📱 Mobile App",
            ]
          : [
              "🚀 বৈশিষ্ট্য",
              "🔄 ওয়ার্কফ্লো",
              "💎 মূল্য নির্ধারণ",
              "🎬 ডেমো",
              "📱 মোবাইল অ্যাপ",
            ],
    },
    {
      title: language === "ENG" ? "Company" : "কোম্পানি",
      items:
        language === "ENG"
          ? [
              "🏢 About",
              "💼 Careers",
              "📞 Contact",
              "📝 Blog",
              "🏆 Success Stories",
            ]
          : [
              "🏢 সম্পর্কে",
              "💼 ক্যারিয়ার",
              "📞 যোগাযোগ",
              "📝 ব্লগ",
              "🏆 সাফল্যের গল্প",
            ],
    },
    {
      title: language === "ENG" ? "Support" : "সহায়তা",
      items:
        language === "ENG"
          ? [
              "❓ Help Center",
              "📚 Documentation",
              "👥 Community",
              "📊 Status",
              "🎓 Training",
            ]
          : [
              "❓ সাহায্য কেন্দ্র",
              "📚 ডকুমেন্টেশন",
              "👥 কমিউনিটি",
              "📊 স্ট্যাটাস",
              "🎓 প্রশিক্ষণ",
            ],
    },
    {
      title: language === "ENG" ? "Solutions" : "সমাধান",
      items:
        language === "ENG"
          ? [
              "🔧 Implementation",
              "🎯 Consultancy",
              "📈 Analytics",
              "🔌 Integrations",
              "🏅 Enterprise",
            ]
          : [
              "🔧 বাস্তবায়ন",
              "🎯 পরামর্শ",
              "📈 বিশ্লেষণ",
              "🔌 ইন্টিগ্রেশন",
              "🏅 এন্টারপ্রাইজ",
            ],
    },
  ];

  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#ffffff", py: 12 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  borderRadius: "50%",
                  p: 2,
                }}
              >
                <AutoFixHigh sx={{ fontSize: 32 }} />
              </Box>
              <Typography sx={{ color: "#fff" }} variant="h4" fontWeight="bold">
                Garage Master
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                mb: 4,
                lineHeight: 1.7,
                fontSize: "1.1rem",
              }}
            >
              {language === "ENG"
                ? "The world's most advanced garage management platform. Complete workflow solution from customer to payment with AI-powered insights and automation."
                : "বিশ্বের সবচেয়ে উন্নত গ্যারেজ ব্যবস্থাপনা প্ল্যাটফর্ম। এআই-চালিত অন্তর্দৃষ্টি এবং অটোমেশন সহ গ্রাহক থেকে পেমেন্ট পর্যন্ত সম্পূর্ণ ওয়ার্কফ্লো সমাধান।"}
            </Typography>
            <Stack direction="row" spacing={3}>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: alpha("#ffffff", 0.3),
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "#ffffff",
                      background: alpha("#ffffff", 0.1),
                    },
                  }}
                >
                  {language === "ENG" ? "Privacy Policy" : "গোপনীয়তা নীতি"}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: alpha("#ffffff", 0.3),
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "#ffffff",
                      background: alpha("#ffffff", 0.1),
                    },
                  }}
                >
                  {language === "ENG"
                    ? "Terms of Service"
                    : "পরিষেবার শর্তাবলী"}
                </Button>
              </motion.div>
            </Stack>
          </Grid>
          {footerSections.map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={2}>
                {section.items.map((item) => (
                  <motion.div key={item} whileHover={{ x: 5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.8,
                        cursor: "pointer",
                        fontSize: "1rem",
                        "&:hover": {
                          opacity: 1,
                          color: "#3b82f6",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item}
                    </Typography>
                  </motion.div>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 6, borderColor: alpha("#ffffff", 0.1) }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Typography variant="body1" sx={{ opacity: 0.6 }}>
            © 2024 Garage Master.{" "}
            {language === "ENG"
              ? "All rights reserved."
              : "সমস্ত অধিকার সংরক্ষিত।"}{" "}
            {language === "ENG"
              ? "Built with ❤️ for garage owners worldwide."
              : "বিশ্বব্যাপী গ্যারেজ মালিকদের জন্য ❤️ দিয়ে তৈরি।"}
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              🌟{" "}
              {language === "ENG"
                ? "Trusted by 2,500+ garages"
                : "২,৫০০+ গ্যারেজ দ্বারা বিশ্বস্ত"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              🚀{" "}
              {language === "ENG"
                ? "Complete Workflow Solution"
                : "সম্পূর্ণ ওয়ার্কফ্লো সমাধান"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              🏆 {language === "ENG" ? "Industry Leader" : "শিল্প নেতা"}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
