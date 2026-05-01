import {
  AccountBalance,
  Business,
  CurrencyExchange,
  DirectionsCar,
  Group,
  Home,
  Inventory,
  LocalShipping,
  Logout,
  Receipt,
  Recycling,
  RequestQuote,
  ShoppingBag,
  ShoppingCart,
  Storage,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { FaProjectDiagram, FaUsers } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";

const LeftSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("tas-auth");
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="mt-14">
      {/* Dashboard */}
      <div>
        <div className="toolTipWrap">
          <NavLink to="/dashboard">
            <Home className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Dashboard</b>
        </div>
      </div>

      {/* Client */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/add-customer">
            <HiOutlineUserGroup className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Client</b>
        </div>
      </div>

      {/* Vehicle Job Card */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/create-job-card">
            <DirectionsCar className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Vehicle Job Card</b>
        </div>
      </div>

      {/* Quotation */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/create-quotation">
            <RequestQuote className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Quotation</b>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/create-invoice">
            <Receipt className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Invoice Card</b>
        </div>
      </div>

      {/* Money Receipt */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/money-receive-create">
            <CurrencyExchange className="tooltipIcon" />
          </NavLink>
          <b className="toolTip text-sm">Money Receipt</b>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/running-project">
            <FaProjectDiagram className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Projects</b>
        </div>
      </div>

      {/* Suppliers */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/add-supplier">
            <LocalShipping className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Suppliers</b>
        </div>
      </div>

      {/* Product */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/add-product">
            <Inventory className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Product</b>
        </div>
      </div>

      {/* Purchase */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/purchase-order">
            <ShoppingCart className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Purchase</b>
        </div>
      </div>

      {/* Inventory */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/stock">
            <ShoppingBag className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Inventory</b>
        </div>
      </div>

      {/* Finance */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/add-income">
            <AccountBalance className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Finance</b>
        </div>
      </div>

      {/* HRM */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/add-employee">
            <FaUsers className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">HRM</b>
        </div>
      </div>

      {/* Tenant & UI Management (Superadmin only) */}
      {user.role === "superadmin" && (
        <div className="mt-[14px]">
          <div className="toolTipWrap">
            <NavLink to="/dashboard/all-tenant-list">
              <Business className="tooltipIcon" />
            </NavLink>
            <b className="toolTip">Tenant Management</b>
          </div>
        </div>
      )}

      {/* All User List */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/all-user-list">
            <Group className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">All User List</b>
        </div>
      </div>

      {/* Recycle Bin */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/recycle-bin-jobcard-list">
            <Recycling className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Recycle Bin</b>
        </div>
      </div>

      {/* Database Backup */}
      <div className="mt-[14px]">
        <div className="toolTipWrap">
          <NavLink to="/dashboard/backup">
            <Storage className="tooltipIcon" />
          </NavLink>
          <b className="toolTip">Data Backup</b>
        </div>
      </div>

      {/* Log Out */}
      <div className="mt-[14px]">
        <div onClick={handleLogout} className="toolTipWrap cursor-pointer">
          <Logout className="tooltipIcon" />
          <b className="toolTip">Log Out</b>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
