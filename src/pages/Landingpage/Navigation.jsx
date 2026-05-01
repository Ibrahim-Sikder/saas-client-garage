/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AutoFixHigh,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Navigation = ({ scrollToSection, language, setLanguage }) => {
  const theme = useTheme();

  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMedium = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(true);

  // Language toggle handler
  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  // Navigation items with dynamic language
  const navItems = [
    {
      label: language === "ENG" ? "Features" : "বৈশিষ্ট্য",
      id: "features",
    },
    {
      label: language === "ENG" ? "Workflow" : "কর্মপ্রবাহ",
      id: "workflow",
    },
    {
      label: language === "ENG" ? "Pricing" : "মূল্য নির্ধারণ",
      id: "pricing",
    },
    {
      label: language === "ENG" ? "Clients" : "ক্লায়েন্ট",
      id: "clients",
    },
    {
      label: language === "ENG" ? "Testimonials" : "সুপারিশ",
      id: "testimonials",
    },
    {
      label: language === "ENG" ? "Consultancy" : "পরামর্শ",
      id: "consultancy",
    },
    {
      label: language === "ENG" ? "Contact" : "যোগাযোগ",
      id: "contact",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkMenuSpace = () => {
      const navContainer = document.getElementById("nav-container");
      const navContent = document.getElementById("nav-content");

      if (navContainer && navContent) {
        const containerWidth = navContainer.offsetWidth;
        const contentWidth = navContent.scrollWidth;

        setShowFullMenu(contentWidth <= containerWidth);
      }
    };

    checkMenuSpace();
    window.addEventListener("resize", checkMenuSpace);

    return () => window.removeEventListener("resize", checkMenuSpace);
  }, [language]);

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const responsiveStyles = {
    logo: {
      extraSmall: { variant: "h6", size: "1.1rem" },
      small: { variant: "h5", size: "1.4rem" },
      medium: { variant: "h5", size: "1.5rem" },
      large: { variant: "h5", size: "1.6rem" },
      extraLarge: { variant: "h5", size: "1.8rem" },
    },
    navButton: {
      extraSmall: { px: 0.8, fontSize: "0.65rem", minWidth: "auto" },
      small: { px: 1, fontSize: "0.7rem", minWidth: "auto" },
      medium: { px: 1.2, fontSize: "0.75rem", minWidth: "auto" },
      large: { px: 1.5, fontSize: "0.8rem", minWidth: "auto" },
      extraLarge: { px: 2, fontSize: "0.85rem", minWidth: "auto" },
    },
    authButton: {
      extraSmall: { px: 1.5, fontSize: "0.65rem" },
      small: { px: 2, fontSize: "0.7rem" },
      medium: { px: 2.5, fontSize: "0.75rem" },
      large: { px: 2, fontSize: "0.8rem" },
      extraLarge: { px: 3.5, fontSize: "0.85rem" },
    },
    langButton: {
      extraSmall: { px: 0.5, fontSize: "0.6rem", minWidth: 30 },
      small: { px: 0.8, fontSize: "0.65rem", minWidth: 35 },
      medium: { px: 1, fontSize: "0.7rem", minWidth: 40 },
      large: { px: 1.2, fontSize: "0.75rem", minWidth: 45 },
      extraLarge: { px: 1.5, fontSize: "0.8rem", minWidth: 50 },
    },
    spacing: {
      extraSmall: 0.3,
      small: 0.5,
      medium: 0.8,
      large: 1,
      extraLarge: 1.2,
    },
  };

  const getCurrentSize = () => {
    if (isExtraSmall) return "extraSmall";
    if (isSmall) return "small";
    if (isMedium) return "medium";
    if (isLarge) return "large";
    return "extraLarge";
  };

  const currentSize = getCurrentSize();
  const shouldShowDrawer = !showFullMenu || isExtraSmall || isSmall;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? alpha("#0f172a", 0.95) : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${alpha("#334155", 0.3)}`
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Container
          maxWidth="xl"
          id="nav-container"
          sx={{
            px: {
              xs: 1,
              sm: 2,
              md: 0,
              lg: 4,
              xl: 0,
            },
          }}
        >
          <Toolbar
            sx={{
              px: { xs: 0, sm: 0.5, md: 1 },
              minHeight: {
                xs: 56,
                sm: 64,
                md: 72,
                lg: 80,
              },
            }}
          >
            {/* Logo Section */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2.5 }}
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              <motion.div
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1,
                }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 30,
                      sm: 34,
                      md: 38,
                      lg: 42,
                      xl: 44,
                    },
                    height: {
                      xs: 30,
                      sm: 34,
                      md: 38,
                      lg: 42,
                      xl: 44,
                    },
                    background:
                      "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 32px ${alpha("#06b6d4", 0.3)}`,
                    flexShrink: 0,
                  }}
                >
                  <AutoFixHigh
                    sx={{
                      color: "white",
                      fontSize: {
                        xs: 16,
                        sm: 18,
                        md: 20,
                        lg: 22,
                        xl: 24,
                      },
                    }}
                  />
                </Box>
              </motion.div>

              <Typography
                variant={responsiveStyles.logo[currentSize].variant}
                component="div"
                sx={{
                  fontWeight: { xs: 400, xl: 600 },
                  letterSpacing: {
                    xs: "-0.3px",
                    sm: "-0.5px",
                    md: "-0.7px",
                    lg: "-0.9px",
                    xl: "-1px",
                  },
                  color: "#fff",
                  fontSize: responsiveStyles.logo[currentSize].size,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {language === "ENG" ? "Garage Master" : "গ্যারেজ মাস্টার"}
              </Typography>
            </Stack>

            {/* Desktop Navigation - Show only when there's enough space */}
            {!shouldShowDrawer ? (
              <Stack
                id="nav-content"
                direction="row"
                spacing={responsiveStyles.spacing[currentSize]}
                alignItems="center"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flexWrap: "nowrap",
                  flexShrink: 1,
                  minWidth: 0,
                  transition: "all 0.3s ease",
                }}
              >
                {/* Navigation items with dynamic language */}
                {navItems.map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -2 }}>
                    <Button
                      variant="text"
                      onClick={() => handleNavClick(item.id)}
                      sx={{
                        fontWeight: {
                          md: 500,
                          lg: 600,
                          xl: 700,
                        },
                        px: responsiveStyles.navButton[currentSize].px,
                        py: {
                          md: 0.8,
                          lg: 1,
                          xl: 1.2,
                        },
                        borderRadius: 2,
                        color: alpha("#ffffff", 0.85),
                        fontSize:
                          responsiveStyles.navButton[currentSize].fontSize,
                        minWidth:
                          responsiveStyles.navButton[currentSize].minWidth,
                        whiteSpace: "nowrap",
                        lineHeight: 1.2,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${alpha(
                            "#06b6d4",
                            0.1,
                          )} 0%, ${alpha("#3b82f6", 0.1)} 100%)`,
                          color: "#ffffff",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}

                {/* Language Toggle Buttons */}
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  onChange={handleLanguageChange}
                  aria-label="language selection"
                  size="small"
                  sx={{
                    ml: responsiveStyles.spacing[currentSize],
                    border: `1px solid ${alpha("#ffffff", 0.3)}`,
                    borderRadius: 2,
                    "& .MuiToggleButton-root": {
                      color: alpha("#ffffff", 0.7),
                      border: "none",
                      px: responsiveStyles.langButton[currentSize].px,
                      py: 0.5,
                      fontSize:
                        responsiveStyles.langButton[currentSize].fontSize,
                      minWidth:
                        responsiveStyles.langButton[currentSize].minWidth,
                      "&.Mui-selected": {
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        color: "#ffffff",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        },
                      },
                      "&:hover": {
                        background: alpha("#ffffff", 0.1),
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  <ToggleButton value="ENG" aria-label="english">
                    ENG
                  </ToggleButton>
                  <ToggleButton value="BN" aria-label="bengali">
                    BN
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Auth Buttons with compact design */}
                <Stack
                  direction="row"
                  spacing={responsiveStyles.spacing[currentSize]}
                  alignItems="center"
                  sx={{
                    ml: responsiveStyles.spacing[currentSize],
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/login"
                      sx={{
                        borderWidth: { md: 1.5, lg: 2 },
                        borderColor: "#06b6d4",
                        color: "#06b6d4",
                        fontWeight: {
                          md: 500,
                          lg: 600,
                          xl: 700,
                        },
                        px: responsiveStyles.authButton[currentSize].px,
                        py: {
                          md: 0.5,
                          lg: 1,
                          xl: 1.2,
                        },
                        borderRadius: 2,
                        fontSize:
                          responsiveStyles.authButton[currentSize].fontSize,
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                        lineHeight: 1.2,
                        "&:hover": {
                          borderWidth: { md: 1.5, lg: 2 },
                          background: alpha("#06b6d4", 0.1),
                          transform: "translateY(-1px)",
                          boxShadow: `0 4px 12px ${alpha("#06b6d4", 0.3)}`,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {language === "ENG" ? "Login" : "লগইন"}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        fontWeight: {
                          md: 500,
                          lg: 600,
                          xl: 700,
                        },
                        px: responsiveStyles.authButton[currentSize].px,
                        py: {
                          md: 0.5,
                          lg: 1,
                          xl: 1.2,
                        },
                        borderRadius: 2,
                        fontSize:
                          responsiveStyles.authButton[currentSize].fontSize,
                        boxShadow: `0 4px 16px ${alpha("#06b6d4", 0.4)}`,
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                        lineHeight: 1.2,
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 20px ${alpha("#06b6d4", 0.5)}`,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {language === "ENG"
                        ? isMedium
                          ? "🚀 Trial"
                          : "🚀 Free Trial"
                        : isMedium
                          ? "🚀 ট্রায়াল"
                          : "🚀 ফ্রি ট্রায়াল"}
                    </Button>
                  </motion.div>
                </Stack>
              </Stack>
            ) : (
              /* Mobile Menu Button - Shows when not enough space or small devices */
              <Stack direction="row" spacing={1} alignItems="center">
                {/* Language Toggle for Mobile */}
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  onChange={handleLanguageChange}
                  aria-label="language selection"
                  size="small"
                  sx={{
                    display: { xs: "flex", sm: "flex" },
                    border: `1px solid ${alpha("#ffffff", 0.3)}`,
                    borderRadius: 2,
                    "& .MuiToggleButton-root": {
                      color: alpha("#ffffff", 0.7),
                      border: "none",
                      px: { xs: 1, sm: 1.5 },
                      py: 0.5,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      "&.Mui-selected": {
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        color: "#ffffff",
                      },
                      "&:hover": {
                        background: alpha("#ffffff", 0.1),
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  <ToggleButton value="ENG" aria-label="english">
                    ENG
                  </ToggleButton>
                  <ToggleButton value="BN" aria-label="bengali">
                    BN
                  </ToggleButton>
                </ToggleButtonGroup>

                <IconButton
                  color="inherit"
                  onClick={() => setIsMenuOpen(true)}
                  sx={{
                    display: {
                      xs: "flex",
                      sm: shouldShowDrawer ? "flex" : "none",
                    },
                    p: { xs: 1, sm: 1.2 },
                  }}
                >
                  <MenuIcon
                    sx={{
                      fontSize: {
                        xs: 24,
                        sm: 28,
                        md: 32,
                      },
                      color: "white",
                    }}
                  />
                </IconButton>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer - Shows full menu when space is limited */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "85%",
              sm: "75%",
              md: "65%",
            },
            maxWidth: 400,
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            color: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            fontSize={{
              xs: "1.1rem",
              sm: "1.3rem",
              md: "1.4rem",
            }}
          >
            {language === "ENG" ? "Menu" : "মেনু"}
          </Typography>
          <IconButton color="inherit" onClick={() => setIsMenuOpen(false)}>
            <CloseIcon
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 24,
                  md: 28,
                },
              }}
            />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: alpha("#ffffff", 0.2) }} />

        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{
                cursor: "pointer",
                py: {
                  xs: 1.25,
                  sm: 1.5,
                  md: 1.75,
                },
                px: {
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                },
                "&:hover": {
                  background: alpha("#ffffff", 0.1),
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.1rem",
                  },
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            mt: "auto",
            display: "flex",
            flexDirection: "column",
            gap: {
              xs: 1.25,
              sm: 1.5,
              md: 2,
            },
          }}
        >
          <Button
            component={Link}
            to="/login"
            fullWidth
            color="inherit"
            sx={{
              py: {
                xs: 0.9,
                sm: 1.1,
                md: 1.25,
              },
              fontSize: {
                xs: "0.85rem",
                sm: "0.9rem",
                md: "0.95rem",
              },
              border: `1px solid ${alpha("#ffffff", 0.3)}`,
              fontWeight: 500,
            }}
          >
            {language === "ENG" ? "Login" : "লগইন"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "#ffffff",
              color: "#06b6d4",
              py: {
                xs: 0.9,
                sm: 1.1,
                md: 1.25,
              },
              fontSize: {
                xs: "0.85rem",
                sm: "0.9rem",
                md: "0.95rem",
              },
              fontWeight: 600,
              "&:hover": {
                background: alpha("#ffffff", 0.9),
                transform: "translateY(-1px)",
                boxShadow: `0 6px 20px ${alpha("#000000", 0.2)}`,
              },
              transition: "all 0.2s ease",
            }}
          >
            {language === "ENG" ? "Free Trial" : "ফ্রি ট্রায়াল"}
          </Button>
        </Box>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar
        sx={{
          minHeight: {
            xs: 56,
            sm: 64,
            md: 72,
            lg: 80,
          },
        }}
      />
    </>
  );
};
