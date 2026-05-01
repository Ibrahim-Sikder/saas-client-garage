/* eslint-disable react/prop-types */

import { Box, Container, Paper, Typography, Grid } from "@mui/material"
import { Build } from "@mui/icons-material"



const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6} lg={7} sx={{ display: { xs: "none", md: "block" } }}>
            <Box sx={{ color: "white", p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Build sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                  Garage Master
                </Typography>
              </Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                The Ultimate Garage Management Solution
              </Typography>
              <Typography variant="h6" paragraph>
                Streamline your garage operations with our comprehensive management system. Track vehicles, manage job
                cards, generate invoices, and more.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" paragraph>
                  • Manage customers and vehicles
                </Typography>
                <Typography variant="body1" paragraph>
                  • Create and track job cards
                </Typography>
                <Typography variant="body1" paragraph>
                  • Generate quotes and invoices
                </Typography>
                <Typography variant="body1" paragraph>
                  • Track employee performance
                </Typography>
                <Typography variant="body1">• Analyze business metrics</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body1" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AuthLayout

