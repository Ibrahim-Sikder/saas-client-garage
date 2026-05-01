export const tableStyle = {
  borderRadius: "10px",
  minWidth: 650,
  borderCollapse: "separate",

  borderSpacing: 0,
  "& th, & td": {
    border: "1px solid #e0e0e0",
    borderBottom: "none",
    borderRight: "none",
    "&:last-child": {
      borderRight: "1px solid #e0e0e0",
    },
  },
  "& tr:last-child td": {
    borderBottom: "1px solid #e0e0e0",
  },
  "& th": {
    borderTop: "1px solid #e0e0e0",
  },
};
export const tableHeaderStyle = { backgroundColor: "#42A1DA" };
export const tableCellStyle = {
  color: "#fff",
  fontWeight: "bold",
  fontSize: "18px",
};
export const tableContainerStyle = {
  borderRadius: "10px",
  overflow: "hidden",
};
export const iconStyle = {
  padding: "8px",
  borderRadius: "4px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "8px",
};

export const editIconStyle = {
  ...iconStyle,
  color: "#1976d2",
  backgroundColor: "rgba(25, 118, 210, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.2)",
  },
};

export const deleteIconStyle = {
  ...iconStyle,
  color: "#d32f2f",
  backgroundColor: "rgba(211, 47, 47, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(211, 47, 47, 0.2)",
  },
};
export const boxStyle = {
  width: "200px",
  height: "100px",
  background: "#eaf4f9",
  border: "3px dashed #007bff",
};