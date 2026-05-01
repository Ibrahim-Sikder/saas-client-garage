/* eslint-disable react/prop-types */
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, Archive, CloudDownload, Delete } from "@mui/icons-material";

const SupplierHeaderActions = ({ anchorEl, onMenuClick, onMenuClose }) => {
  return (
    <>
      <IconButton onClick={onMenuClick} sx={{ ml: 1 }}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        <MenuItem onClick={onMenuClose}>
          <Archive sx={{ mr: 1, fontSize: 18 }} /> Archive Supplier
        </MenuItem>
        <MenuItem onClick={onMenuClose}>
          <CloudDownload sx={{ mr: 1, fontSize: 18 }} /> Export Data
        </MenuItem>
        <MenuItem onClick={onMenuClose}>
          <Delete sx={{ mr: 1, fontSize: 18 }} /> Delete Supplier
        </MenuItem>
      </Menu>
    </>
  );
};

export default SupplierHeaderActions;