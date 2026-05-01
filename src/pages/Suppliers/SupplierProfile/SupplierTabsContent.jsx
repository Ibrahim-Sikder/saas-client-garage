/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import ProfileOverview from "./ProfileOverview";
import OrderTable from "./OrderTable";
import SupplierProduct from "./SupplierProduct";
import SupplierBillPay from "./SupplierBillPay";
import SupplierPurchase from "./SupplierPurchase";
import SupplierPurchaseReturn from "./SupplierPurchaseReturn";

const SupplierTabsContent = ({ tabValue, supplier, }) => {
  return (
    <>
      <Box sx={{ display: tabValue === 0 ? "block" : "none" }}>
        <ProfileOverview supplier={supplier} />
      </Box>
      <Box sx={{ display: tabValue === 1 ? "block" : "none" }}>
        <OrderTable orderData={supplier?.orders} />
      </Box>
      <Box sx={{ display: tabValue === 2 ? "block" : "none" }}>
        <SupplierProduct productData={supplier?.products} />
      </Box>
      
      <Box sx={{ display: tabValue === 3 ? "block" : "none" }}>
        <SupplierPurchase purchaseData={supplier?.purchases} />
      </Box>
      <Box sx={{ display: tabValue === 4 ? "block" : "none" }}>
        <SupplierPurchaseReturn supplier={supplier} />
      </Box>
      <Box sx={{ display: tabValue === 5 ? "block" : "none" }}>
        <SupplierBillPay supplier={supplier} />
      </Box>
    </>
    
  );
};

export default SupplierTabsContent;