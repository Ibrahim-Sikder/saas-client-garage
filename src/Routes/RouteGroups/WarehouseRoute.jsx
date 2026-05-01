import WarehouseManagement from "../../pages/Inventory/Warehouse/WarehouseManagement";
import WarehouseStockOverview from "../../pages/Inventory/Warehouse/WarehouseStockOverview";

export const warehouseRoutes = [
  {
    path: "warehouse",
    element: <WarehouseManagement />,
  },
  {
    path: "warehouse-stock",
    element: <WarehouseStockOverview />,
  },
];
