"use client";

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Chip,
  InputAdornment,
  Tooltip,
  CircularProgress,
  alpha,
  Avatar,
  Pagination,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useDeleteCategoryMutation,
  useGetAllICategoryQuery,
} from "../../redux/api/categoryApi";
import { DataGrid } from "@mui/x-data-grid";

import { usePermissions } from "../../context/PermissionContext";
import Can from "../../components/Can";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { CreateCategoryModal } from "./CreateCategoryModal";


export default function CategoryList() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const theme = useTheme();

  const { data, isLoading, refetch } = useGetAllICategoryQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });
  const [deleteCategory] = useDeleteCategoryMutation();
  const categories = data?.data?.categories || [];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleOpen = () => {
    setUpdateOpen(null);
    setOpen(true);
  };

  const handleUpdateOpen = (id) => {
    setUpdateOpen(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpdateOpen(null);
  };

  const handleDeleteClick = (id) => {
    performActionWithPermission('/dashboard/category', 'delete',
      async () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",

        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteCategory({ tenantDomain, id }).unwrap();
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "The category has been deleted successfully.",
                showConfirmButton: false,
                timer: 2000,
                background: "#fff",

              });
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: "An error occurred while deleting the category.",
                confirmButtonColor: theme.palette.error.main,
              });
            }
          }
        });
      }, "You don't have permission to delete category"
    )
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().then(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    });
  };

  const { meta } = data?.data || { meta: {} };
  const { totalPage = 10 } = meta || {};

  const columns = [
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.main_category}
          variant="rounded"
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            bgcolor: alpha("#42A1DA", 0.1),
          }}
        >
          <CategoryIcon sx={{ color: alpha("#42A1DA", 0.7) }} />
        </Avatar>
      ),
    },
    {
      field: "main_category",
      headerName: "Main Category",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "sub_category",
      headerName: "Sub Category",
      flex: 2,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha("#42A1DA", 0.1),
            color: "#42A1DA",
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleUpdateOpen(params.row.id)}
              sx={{
                bgcolor: alpha("#42A1DA", 0.1),
                color: "#42A1DA",
                "&:hover": {
                  bgcolor: alpha("#42A1DA", 0.2),
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Can page='/dashboard/category' action='delete'>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(params.id)}
                sx={{
                  bgcolor: alpha("#d32f2f", 0.1),
                  color: "#d32f2f",
                  "&:hover": {
                    bgcolor: alpha("#d32f2f", 0.2),
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Can>
        </Box>
      ),
    },
  ];

  const rows = categories.map((category) => ({
    id: category._id,
    image: category.image,
    main_category: category.main_category,
    sub_category: category.sub_category,
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f9f9f9, #f0f0f0)",
        pt: 2,
        pb: 8,
      }}
    >
      {/* Header */}
      <div className="bg-[#42A1DA] text-white py-6 mb-6 rounded-b-[20px] shadow-[0_4px_20px_rgba(66,161,218,0.4)]">
        <Container maxWidth="xl">
          <div className="flex items-center mb-4">
            <CategoryIcon className="text-[40px] mr-4" />
            <h1 className="md:text-3xl font-bold">Category Management</h1>
          </div>
          <p className="opacity-90 max-w-[700px]">
            Manage your product categories to better organize your inventory and improve searchability.
          </p>
        </Container>
      </div>

      <Container maxWidth="xl" sx={{ p: { xs: 0, md: 2 } }}>
        {/* Search and Actions */}
        <div className="md:flex items-center justify-between p-4 mb-4 rounded-xl shadow-md bg-white">
          <div className="mb-2 md:mb-0 flex-1 mr-4">
            <TextField
              fullWidth
              placeholder="Search categories by name..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 100, pr: 1 },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(66, 161, 218, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#42A1DA",
                  },
                },
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{
                borderRadius: 100,
                background: "#42A1DA",
                boxShadow: "0 4px 10px rgba(66, 161, 218, 0.3)",
                px: 3,
                color: "white",
                "&:hover": {
                  background: "#2a8fc7",
                },
              }}
            >
              Create Category
            </Button>

            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  bgcolor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                {isRefreshing ? (
                  <CircularProgress size={20} sx={{ color: "#42A1DA" }} />
                ) : (
                  <RefreshIcon />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Data Grid */}
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
            "& .MuiDataGrid-root": {
              minWidth: "800px",
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              border: 0,
            },
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
              borderRadius: 2,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              borderRadius: 2,
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: alpha("#42A1DA", 0.04),
              },
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              border: 0,
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          />
        </Box>

        {/* Pagination */}
        {categories.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Pagination
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "#42A1DA",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#2a8fc7",
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Create/Edit Modal */}
        {open && (
          <CreateCategoryModal
            categoryId={updateOpen}
            open={open}
            setOpen={handleClose}
          />
        )}
      </Container>
    </Box>
  );
}