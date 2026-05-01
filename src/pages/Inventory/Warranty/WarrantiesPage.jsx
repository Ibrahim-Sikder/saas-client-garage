/* eslint-disable react/prop-types */
import { Box, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { PageHeader } from "./PageHeader";
import { useWarranties } from "../../../hooks/useWarranties";
import WarrantyModal from "./WarrantyModal";
import { ProductTooltip } from "./ProductTooltip";
import Table from "../../../components/Table";
import { DeleteIcon, EditIcon } from "lucide-react";

export default function WarrantiesPage() {
  const theme = useTheme();
  const {
    openModal,
    editingWarranty,
    warranties,
    isLoading,

    setSearchTerm,
    handleOpenModal,
    handleCloseModal,
    handleEditWarranty,
    handleDeleteWarranty,
    refetch,
    tenantDomain,
  } = useWarranties();

  const columns = [
    { key: "name", label: "Name", render: (w) => w.name },
    { key: "description", label: "Description", render: (w) => w.description },
    {
      key: "duration",
      label: "Duration",
      render: (w) => `${w.duration} ${w.durationType}`,
    },
    {
      key: "products",
      label: "Products",
      render: (w) => (
        <ProductTooltip products={w.products}>
          {w.totalProducts} product{w.totalProducts !== 1 ? "s" : ""}
        </ProductTooltip>
      ),
    },
    { key: "terms", label: "Terms", render: (w) => w.terms },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      onClick: handleEditWarranty,
      tooltip: "Edit Warranty",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      onClick: (warranty) => handleDeleteWarranty(warranty._id),
      requirePermission: true,
      permissionPage: "/dashboard/warranties",
      permissionAction: "delete",
      tooltip: "Delete Warranty",
      color: "#d32f2f",
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, ${alpha(
          theme.palette.primary.light,
          0.1
        )}, ${alpha(theme.palette.background.default, 0.1)})`,
        minHeight: "100vh",
        p: 1,
      }}
    >
      <BreadcrumbNavigation />
      <PageHeader handleOpenModal={handleOpenModal} />

      <Table
        title="Warranties"
        columns={columns}
        data={warranties.data || []}
        actions={actions}
        loading={isLoading}
        onSearch={setSearchTerm}
        currentPage={warranties.meta?.page || 1}
        totalPages={
          warranties.meta
            ? Math.ceil(warranties.meta.total / warranties.meta.limit)
            : 1
        }
      />

      <WarrantyModal
        open={openModal}
        onClose={handleCloseModal}
        editingWarranty={editingWarranty}
        refetch={refetch}
        tenantDomain={tenantDomain}
      />
    </Box>
  );
}
