/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import Swal from "sweetalert2";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { useReactToPrint } from "react-to-print";
import {
  useDeleteBarcodeMutation,
  useGetAllIBarcodeQuery,
} from "../../redux/api/barcodeApi";
import { theme } from "../../Theme";
import { Box } from "@mui/material";
import { useTenantDomain } from "../../hooks/useTenantDomain";

export default function BarcodeTable() {
  const { tenantDomain } = useTenantDomain();

  const [deleteCategory] = useDeleteBarcodeMutation();
  const { data } = useGetAllIBarcodeQuery({ tenantDomain });
  const barcodes = data?.data?.barcodes || [];

  const [printCount, setPrintCount] = useState(1);
  const [printUrl, setPrintUrl] = useState("");
  const contentToPrint = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePrintClick = (event, url) => {
    setAnchorEl(event.currentTarget);
    setPrintUrl(url);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    onAfterPrint: () => {
      setPrintCount(1);
      setPrintUrl("");
    },
  });

  const rows = barcodes.map((barcode) => ({
    id: barcode._id,
    barcode: barcode.barcode?.url,
    name: barcode.name,
    description: barcode.description,
  }));

  const columns = [
    {
      field: "barcode",
      headerName: "Barcode",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="brand"
          style={{
            width: 200,
            height: 50,
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ),
    },
    { field: "name", headerName: "Barcode Name", flex: 2 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          <IconButton
            sx={{ ...iconButtonStyle, background: "#42A1DA" }}
            title="Print"
            onClick={(event) => handlePrintClick(event, params.row.barcode)}
          >
            <PrintIcon sx={iconStyle} />
          </IconButton>

          <IconButton sx={iconButtonStyle} title="Delete">
            <DeleteIcon
              onClick={() => handleDelete(params.id)}
              sx={iconStyle}
            />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory({ tenantDomain, id }).unwrap();
          Swal.fire("Deleted!", "Barcode has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the barcode.",
            "error",
          );
        }
      }
    });
  };

  const iconButtonStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "100%",
    padding: "0px",
    color: "white",
    background: "red",
    marginLeft: "2px",
    marginRight: "2px",
    "&:hover": {
      background: "black",
      color: "white",
    },
  };
  const iconStyle = { fontSize: "20px" };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.divider,
          borderRadius: "3px",
        },
      }}
    >
      <div className="mt-5" style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          checkboxSelection
        />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ padding: "16px" }}>
          <Input
            type="number"
            value={printCount}
            onChange={(e) => setPrintCount(Number(e.target.value))}
            placeholder="Enter count"
            min={1}
            style={{ marginBottom: "8px", width: "100%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handlePopoverClose();
              handlePrint();
            }}
          >
            Print
          </Button>
        </div>
      </Popover>

      <div style={{ display: "none" }}>
        <div
          ref={contentToPrint}
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          {[...Array(printCount)].map((_, index) => (
            <img
              key={index}
              src={printUrl}
              alt="barcode"
              style={{
                maxWidth: "300px",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          ))}
        </div>
      </div>
    </Box>
  );
}
