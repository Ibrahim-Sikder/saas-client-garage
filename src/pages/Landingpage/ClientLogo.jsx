/* eslint-disable react/prop-types */
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useGetAllCompanyBrandsQuery } from "../../redux/api/companyBrandApi";
import Loading from "../../components/Loading/Loading";

export const ClientLogos = ({ language }) => {
  const { data, isLoading } = useGetAllCompanyBrandsQuery({});
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      id="clients"
      sx={{
        py: 8,
        background: "rgba(6, 182, 212, 0.02)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {language === "ENG"
              ? "Trusted by 2,500+ Garage Owners Worldwide"
              : "বিশ্বব্যাপী ২,৫০০+ গ্যারেজ মালিকদের দ্বারা বিশ্বস্ত"}
          </Typography>
        </Box>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {data?.data?.data?.map((client, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    border: `1px solid rgba(6, 182, 212, 0.1)`,
                    borderRadius: 3,
                    "&:hover": {
                      background: "rgba(6, 182, 212, 0.02)",
                      borderColor: "rgba(6, 182, 212, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box
                    component="img"
                    src={client.logo}
                    alt={client.name}
                    sx={{
                      width: "100%",
                      height: 100,
                      objectFit: "contain",
                      filter: "grayscale(100%)",
                      "&:hover": {
                        filter: "grayscale(0%)",
                      },
                      transition: "filter 0.3s ease",
                    }}
                  />
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
