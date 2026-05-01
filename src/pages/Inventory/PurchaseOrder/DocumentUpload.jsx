/* eslint-disable react/prop-types */
// components/PurchaseOrder/DocumentUpload.jsx

import { motion } from "framer-motion";
import { ReceiptLong as ReceiptLongIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import ImageUpload from "../../../components/form/ImageUpload";

const DocumentUpload = ({ defaultDocument }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ReceiptLongIcon sx={{ color: "white", mr: 1.5 }} />
        <Typography variant="h6" fontWeight="700" color="white">
          Document
        </Typography>
      </Box>
      <CardContent
        sx={{
          p: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
          Attach invoice or related documents for this purchase order
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <ImageUpload
            defaultValues={defaultDocument}
            fullWidth
            name="attachDocument"
            label="Attach Document"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;