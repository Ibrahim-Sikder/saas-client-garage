/* eslint-disable react/prop-types */
import { CheckCircle, Delete, Edit, Visibility } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Can from "../../../components/Can";

const ActionMenu = ({
  anchorEl,
  selectedOrder,
  onMenuClose,
  onViewOrder,
  onEditOrder,
  onOpenReceiveDialog,
  onDeleteOrder,
}) => {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onMenuClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <MenuItem onClick={onViewOrder} sx={{ py: 1.5 }}>
        <Visibility
          fontSize="small"
          sx={{ mr: 1, color: theme.palette.info.main }}
        />
        View
      </MenuItem>
      <MenuItem onClick={onEditOrder} sx={{ py: 1.5 }}>
        <Can page='/dashboard/purchase-order' action='edit'>
          <Edit
            fontSize="small"
            sx={{ mr: 1, color: theme.palette.warning.main }}
          />
          Edit
        </Can>
      </MenuItem>
      <MenuItem
        onClick={onOpenReceiveDialog}
        disabled={
          !selectedOrder ||
          selectedOrder.status === "received" ||
          selectedOrder.status === "cancelled"
        }
        sx={{ py: 1.5 }}
      >
        <Can page='/dashboard/purchase-order' action='edit'>
          <CheckCircle
            fontSize="small"
            sx={{ mr: 1, color: theme.palette.success.main }}
          />
          Receive
        </Can>
      </MenuItem>
      <MenuItem onClick={onDeleteOrder} sx={{ py: 1.5 }}>
        <Can page='/dashboard/purchase-order' action='delete'>
          <Delete
            fontSize="small"
            sx={{ mr: 1, color: theme.palette.error.main }}
          />
          Delete
        </Can>

      </MenuItem>
    </Menu>
  );
};

export default ActionMenu;