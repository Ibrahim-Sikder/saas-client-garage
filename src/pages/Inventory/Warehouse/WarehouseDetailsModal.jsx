/* eslint-disable react/prop-types */

import {
  Box,
  Typography,

  Grid,
  Card,
  CardContent,
  Button,
  Paper,
} from "@mui/material"
import {
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Map as MapIcon,
} from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { GoogleMap, Marker } from "@react-google-maps/api"
import GarageModal from "../../../components/Share/Modal/GarageModal"
import { purchaseBtn } from "../../../utils/customStyle"

const ViewWarehouseDetails = ({
  open,
  onClose,
  warehouse,
  isLoaded,
  getTypeChip,
  getStatusChip,
  onEdit,
  setOpen,
}) => {
  const theme = useTheme()

  if (!warehouse) return null

  const getValidCoordinate = (value, defaultValue) => {
    const parsed = Number.parseFloat(value)
    return !isNaN(parsed) ? parsed : defaultValue
  }

  const latitude = getValidCoordinate(warehouse.latitude, 23.8103)
  const longitude = getValidCoordinate(warehouse.longitude, 90.4125)
  const validMapCenter = {
    lat: latitude,
    lng: longitude,
  }

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={warehouse.name}
      maxWidth="md"
    >

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Warehouse Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type:
                  </Typography>
                  <Typography variant="body1">{getTypeChip(warehouse.type)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography variant="body1">{getStatusChip(warehouse.status)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body1">{warehouse.createdAt}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description:
                  </Typography>
                  <Typography variant="body1">{warehouse.description}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Manager:
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon
                      sx={{
                        mr: 0.5,
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    />
                    {warehouse.manager}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Phone:
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon
                      sx={{
                        mr: 0.5,
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    />
                    {warehouse.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon
                      sx={{
                        mr: 0.5,
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    />
                    {warehouse.email}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Inventory Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Items:
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                    {warehouse.totalItems ? warehouse.totalItems.toLocaleString() : "0"}
                  </Typography>
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Location Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Address:
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon
                      sx={{
                        mr: 0.5,
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    />
                    {warehouse.address}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    City:
                  </Typography>
                  <Typography variant="body1">{warehouse.city}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Division:
                  </Typography>
                  <Typography variant="body1">{warehouse.division}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Country:
                  </Typography>
                  <Typography variant="body1">{warehouse.country}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Postal Code:
                  </Typography>
                  <Typography variant="body1">{warehouse.postalCode}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Coordinates:
                  </Typography>
                  <Typography variant="body1">
                    {isNaN(Number.parseFloat(warehouse.latitude)) || isNaN(Number.parseFloat(warehouse.longitude)) ? (
                      <span style={{ color: theme.palette.error.main }}>
                        Invalid coordinates. Using default Dhaka location.
                      </span>
                    ) : (
                      `${latitude}, ${longitude}`
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, height: 300, overflow: "hidden" }}>
            <CardContent sx={{ p: 0, height: "100%" }}>
              {isLoaded ? (
                <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={validMapCenter} zoom={15}>
                  <Marker position={validMapCenter} />
                </GoogleMap>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    flexDirection: "column",
                    background: "url('/placeholder.svg?height=300&width=500') center/cover",
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: 2,
                    }}
                  >
                    <MapIcon sx={{ fontSize: 48, color: "#006a4e", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Map of Bangladesh
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Location: {warehouse.city}, {warehouse.division}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='end'>
        <Button
          onClick={() => {
            onClose()
            onEdit(warehouse._id)
          }}
          variant="contained"
          startIcon={<EditIcon />}
          sx={purchaseBtn}
        >
          Edit Warehouse
        </Button>
      </Box>
    </GarageModal>
  )
}

export default ViewWarehouseDetails