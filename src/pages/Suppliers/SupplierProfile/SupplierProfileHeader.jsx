/* eslint-disable react/prop-types */
import { Avatar, Box, Typography, Chip, Button, Tooltip } from "@mui/material";
import { Phone, Email, Category, VerifiedUser, ShoppingCart, StarBorder, Star } from "@mui/icons-material";
import { GlassCard, StatusChip, StyledRating } from "./supplier";
import { getStatusColor, getStatusIcon } from "../../../constant/constant";

const SupplierProfileHeader = ({ supplier, onNewOrder }) => {
  return (
    <GlassCard elevation={0} sx={{ mb: 3, overflow: "hidden" }}>
      <Box
        sx={{
          height: 150,
          background: "linear-gradient(135deg, #FF9800 0%, #FF5722 100%)",
          position: "relative",
          mb: -10,
          borderRadius: "16px 16px 0 0",
        }}
      />

      <Box sx={{ px: 4, pb: 3, position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", position: "relative" }}>
          <Avatar
            src={supplier?.company_logo || "/placeholder.svg?height=150&width=150"}
            alt={supplier?.full_name || "Supplier"}
            sx={{
              width: 150,
              height: 150,
              border: "5px solid white",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              mt: -10,
            }}
          />

          <Box sx={{ ml: 3, mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h4" fontWeight="bold">
                {supplier?.full_name || "Loading..."}
              </Typography>
              <StatusChip
                icon={getStatusIcon(supplier?.supplier_status || "Pending")}
                label={supplier?.supplier_status || "Pending"}
                size="small"
                statuscolor={getStatusColor(supplier?.supplier_status || "Pending")}
                sx={{ ml: 2 }}
              />
              <Tooltip title="Verified Supplier">
                <VerifiedUser sx={{ ml: 1, color: "#2196f3" }} />
              </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <Category sx={{ fontSize: 18, mr: 0.5, color: "#757575" }} />
              <span style={{ color: "#757575" }}>{supplier?.vendor || "Supplier"}</span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <StyledRating
                name="supplier-rating"
                value={supplier?.supplier_rating || 0}
                precision={0.1}
                readOnly
                icon={<Star fontSize="inherit" />}
                emptyIcon={<StarBorder fontSize="inherit" />}
              />
              <Typography variant="body2" sx={{ ml: 1, color: "#757575" }}>
                ({supplier?.supplier_rating || 0})
              </Typography>
            </Box>
          </Box>

          <Box sx={{ ml: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", mt: 3 }}>
            <Button
              onClick={onNewOrder}
              variant="contained"
              startIcon={<ShoppingCart />}
              sx={{
                borderRadius: 20,
                px: 3,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              }}
            >
              New Order
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Chip
                icon={<Phone fontSize="small" />}
                label={supplier?.phone_number || "N/A"}
                variant="outlined"
                sx={{ mr: 1, borderRadius: 20 }}
              />
              <Chip
                icon={<Email fontSize="small" />}
                label={supplier?.email || "N/A"}
                variant="outlined"
                sx={{ borderRadius: 20 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Supplier ID
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {supplier?.supplierId || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ mr: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Joined
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {supplier?.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tax ID
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {supplier?.tax_id || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </GlassCard>
  );
};

export default SupplierProfileHeader;