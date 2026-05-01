/* eslint-disable react/prop-types */
import { Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Can from "../../../components/Can";

const ActionMenu = ({ anchorEl, onClose, onView, onEdit, onDelete }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      },
    }}
  >
    <MenuItem onClick={onView} sx={{ py: 1.5 }}>
      <VisibilityIcon
        fontSize="small"
        sx={{ mr: 1, color: theme => theme.palette.primary.main }}
      />
      View Details
    </MenuItem>
    <MenuItem onClick={onEdit} sx={{ py: 1.5 }}>
      <Can page='/dashboard/purchase-return' action='edit'>
        <EditIcon
          fontSize="small"
          sx={{ mr: 1, color: theme => theme.palette.warning.main }}
        />
        Edit
      </Can>

    </MenuItem>
    <MenuItem onClick={onDelete} sx={{ py: 1.5 }}>
      <Can page='/dashboard/purchase-return' action='delete'>
        <DeleteIcon
          fontSize="small"
          sx={{ mr: 1, color: theme => theme.palette.error.main }}
        />
        Delete
      </Can>
    </MenuItem>

  </Menu>
);
export default ActionMenu