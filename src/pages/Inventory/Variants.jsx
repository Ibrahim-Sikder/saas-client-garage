"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CategoryIcon from "@mui/icons-material/Category";
import SearchIcon from "@mui/icons-material/Search";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import StyleIcon from "@mui/icons-material/Style";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";

const initialVariants = [
  {
    id: 1,
    name: "Size",
    description: "Product size",
    values: ["Small", "Medium", "Large"],
    productCount: 45,
    icon: "FormatSize",
    color: "#4CAF50",
  },
  {
    id: 2,
    name: "Color",
    description: "Product color",
    values: ["Red", "Green", "Blue", "Black", "White"],
    productCount: 32,
    icon: "ColorLens",
    color: "#2196F3",
  },
  {
    id: 3,
    name: "Model",
    description: "Product model",
    values: ["A", "B", "C", "Premium"],
    productCount: 28,
    icon: "Style",
    color: "#9C27B0",
  },
  {
    id: 4,
    name: "Material",
    description: "Product material",
    values: ["Plastic", "Metal", "Rubber"],
    productCount: 15,
    icon: "Category",
    color: "#FF5722",
  },
];

export default function VariantsPage() {
  const theme = useTheme();
  const [variants, setVariants] = useState(initialVariants);
  const [open, setOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    values: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);

  const handleClickOpen = () => {
    setFormData({ name: "", description: "", values: "" });
    setEditingVariant(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditVariant = (variant) => {
    setFormData({
      name: variant.name,
      description: variant.description,
      values: variant.values.join(", "),
    });
    setEditingVariant(variant);
    setOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setVariantToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setVariantToDelete(null);
  };

  const handleDeleteVariant = () => {
    if (variantToDelete !== null) {
      setVariants(variants.filter((variant) => variant.id !== variantToDelete));
      closeDeleteConfirm();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      const valueArray = formData.values
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      if (editingVariant) {
        // Update existing variant
        setVariants(
          variants.map((variant) =>
            variant.id === editingVariant.id
              ? {
                  ...variant,
                  name: formData.name,
                  description: formData.description,
                  values: valueArray,
                }
              : variant
          )
        );
      } else {
        // Add new variant
        const icons = ["FormatSize", "ColorLens", "Style", "Category"];
        const colors = [
          "#4CAF50",
          "#2196F3",
          "#9C27B0",
          "#FF5722",
          "#FF9800",
          "#03A9F4",
          "#E91E63",
        ];

        const newVariant = {
          id: Math.max(...variants.map((v) => v.id), 0) + 1,
          name: formData.name,
          description: formData.description,
          values: valueArray,
          productCount: 0,
          icon: icons[Math.floor(Math.random() * icons.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setVariants([...variants, newVariant]);
      }

      setLoading(false);
      handleClose();
    }, 800);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getVariantIcon = (iconName) => {
    switch (iconName) {
      case "FormatSize":
        return <FormatSizeIcon />;
      case "ColorLens":
        return <ColorLensIcon />;
      case "Style":
        return <StyleIcon />;
      case "Category":
        return <CategoryIcon />;
      default:
        return <LocalOfferIcon />;
    }
  };

  const filteredVariants = variants
    .filter(
      (variant) =>
        variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.values.some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "productCount") {
        comparison = a.productCount - b.productCount;
      } else if (sortBy === "valuesCount") {
        comparison = a.values.length - b.values.length;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, ${alpha(
          theme.palette.primary.light,
          0.1
        )}, ${alpha(theme.palette.background.default, 0.1)})`,
        minHeight: "100vh",
        p: 1,
        mt: 2,
        borderRadius: 2,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link color="inherit" href="/inventory">
          Inventory
        </Link>
        <Typography color="text.primary">Variant Attributes</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            textFillColor: "transparent",
            display: "inline-block",
          }}
        >
          <StyleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Variant Attributes
        </Typography>

        <div className="md:flex gap-2">
          <div className="flex md:hidden justify-end mb-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 10px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: `0 6px 15px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              New Variant
            </Button>
          </div>

          <TextField
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ width: { xs: "100%", sm: 220 } }}
          />

          <div className="hidden md:flex justify-end mb-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 10px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: `0 6px 15px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              New Variant
            </Button>
          </div>
        </div>
      </Box>

      <div className="mb-4 md:flex items-center gap-2 space-x-3 space-y-3">
        <p className="text-gray-600 text-base">Sort by:</p>
        <Button
          size="small"
          variant={sortBy === "name" ? "contained" : "outlined"}
          onClick={() => handleSort("name")}
          endIcon={
            sortBy === "name" ? (
              sortOrder === "asc" ? (
                <SortIcon />
              ) : (
                <SortIcon sx={{ transform: "rotate(180deg)" }} />
              )
            ) : null
          }
          sx={{ minWidth: 100 }}
        >
          Name
        </Button>
        <Button
          size="small"
          variant={sortBy === "productCount" ? "contained" : "outlined"}
          onClick={() => handleSort("productCount")}
          endIcon={
            sortBy === "productCount" ? (
              sortOrder === "asc" ? (
                <SortIcon />
              ) : (
                <SortIcon sx={{ transform: "rotate(180deg)" }} />
              )
            ) : null
          }
          sx={{ minWidth: 100 }}
        >
          Products
        </Button>
        <Button
          size="small"
          variant={sortBy === "valuesCount" ? "contained" : "outlined"}
          onClick={() => handleSort("valuesCount")}
          endIcon={
            sortBy === "valuesCount" ? (
              sortOrder === "asc" ? (
                <SortIcon />
              ) : (
                <SortIcon sx={{ transform: "rotate(180deg)" }} />
              )
            ) : null
          }
          sx={{ minWidth: 100 }}
        >
          Values
        </Button>
      </div>

      {filteredVariants.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No variants found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            There are no variants matching your search term
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add New Variant
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {filteredVariants.map((variant) => (
            <Grid item xs={12} sm={6} md={3} key={variant.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "visible",
                  boxShadow: `0 8px 24px ${alpha(variant.color, 0.15)}`,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0 12px 28px ${alpha(variant.color, 0.25)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -15,
                    left: 20,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(45deg, ${
                      variant.color
                    }, ${alpha(variant.color, 0.8)})`,
                    boxShadow: `0 4px 12px ${alpha(variant.color, 0.4)}`,
                    color: "#fff",
                  }}
                >
                  {getVariantIcon(variant.icon)}
                </Box>

                <CardContent
                  sx={{
                    pt: 4,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, color: variant.color }}
                  >
                    {variant.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {variant.description}
                  </Typography>

                  <Box sx={{ mb: 2, flexGrow: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Values:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {variant.values.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: alpha(variant.color, 0.1),
                            color: variant.color,
                            borderRadius: 1,
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Chip
                      label={`${variant.productCount} products`}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    />

                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditVariant(variant)}
                          sx={{
                            color: theme.palette.primary.main,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => openDeleteConfirm(variant.id)}
                          sx={{
                            color: theme.palette.error.main,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Variant Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {editingVariant ? "Edit Variant" : "Add New Variant"}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Variant Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          <TextField
            margin="dense"
            name="values"
            label="Values (separate with commas)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.values}
            onChange={handleInputChange}
            helperText="Example: Red, Green, Blue"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {editingVariant ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Delete Variant</DialogTitle>

        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this variant?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDeleteConfirm} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteVariant}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
