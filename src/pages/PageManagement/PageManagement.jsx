import { useState, useMemo } from "react";
import { Typography, Chip, Box, Avatar, alpha, Button } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Route as RouteIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  LocalOffer as TagIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from "@mui/icons-material";
import { DeleteIcon, EditIcon } from "lucide-react";

import PageHeader from "./PageHeader";
import PageForm from "./PageForm";
import Table from "@/components/Table";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import {
  useGetAllPagesQuery,
  useDeletePageMutation,
} from "../../redux/api/pageApi";
import Swal from "sweetalert2";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";

const PAGE_SIZE = 10;

const PageManagement = () => {
  const { tenantDomain } = useTenantDomain();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("view");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: pageData,
    isLoading,
    refetch,
  } = useGetAllPagesQuery({ tenantDomain });
  const [deletePage] = useDeletePageMutation();

  // Search + pagination logic
  const filteredPages = useMemo(() => {
    if (!pageData?.data) return [];
    const filtered = pageData.data.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [pageData, searchTerm, currentPage]);

  const totalPages = useMemo(() => {
    if (!pageData?.data) return 1;
    return Math.ceil(
      pageData.data.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).length / PAGE_SIZE
    );
  }, [pageData, searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPage(null);
  };

  const handleDeletePageAction = async (page) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
      });

      if (result.isConfirmed) {
        await deletePage({ id: page._id, tenantDomain }).unwrap();
        Swal.fire("Deleted!", "Page has been deleted.", "success");
        handleDialogClose();
        refetch();
      }
    } catch (error) {
      Swal.fire("Error!", error.message || "Failed to delete page", "error");
    }
  };

  const handleCreatePage = () => {
    setDialogType("create");
    setOpenDialog(true);
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    setDialogType("edit");
    setOpenDialog(true);
  };

  // Columns
  const columns = [
    {
      key: "name",
      label: "Page Name",
      render: (page) => (
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              mr: 2,
              bgcolor: alpha("#1976d2", 0.1),
              color: "#1976d2",
            }}
          >
            {{
              Main: <DashboardIcon />,
              Operations: <RouteIcon />,
              Resources: <TagIcon />,
              Staff: <PeopleIcon />,
              Analytics: <DescriptionIcon />,
              System: <SettingsIcon />,
              Admin: <PeopleIcon />,
            }[page.category] || <DescriptionIcon />}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {page.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {page.description}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (page) => (
        <Chip
          icon={
            {
              Main: <DashboardIcon />,
              Operations: <RouteIcon />,
              Resources: <TagIcon />,
              Staff: <PeopleIcon />,
              Analytics: <DescriptionIcon />,
              System: <SettingsIcon />,
              Admin: <PeopleIcon />,
            }[page.category] || <DescriptionIcon />
          }
          label={page.category}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      key: "path",
      label: "Path",
      render: (page) => (
        <Typography variant="body2" fontFamily="monospace">
          {page.path}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (page) => (
        <Chip
          icon={page.status === "active" ? <ActiveIcon /> : <InactiveIcon />}
          label={page.status === "active" ? "Active" : "Inactive"}
          size="small"
          sx={{
            bgcolor: alpha(
              page.status === "active" ? "#2e7d32" : "#d32f2f",
              0.1
            ),
            color: page.status === "active" ? "#2e7d32" : "#d32f2f",
            fontWeight: "bold",
          }}
        />
      ),
    },
  ];

  // Actions
  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit Page",
      onClick: handleEditPage,
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Page",
      onClick: handleDeletePageAction,
    },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <PageHeader pageData={pageData} />

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button sx={purchaseBtn} onClick={handleCreatePage}>
          Create Page
        </Button>
      </Box>

      <Table
        title="Pages"
        columns={columns}
        data={filteredPages}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search pages..."
        onSearch={handleSearchChange}
        emptyMessage="No pages found"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {openDialog && (
        <PageForm
          open={openDialog}
          onClose={handleDialogClose}
          pageData={selectedPage}
          mode={dialogType}
          tenantDomain={tenantDomain}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default PageManagement;
