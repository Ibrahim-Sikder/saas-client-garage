/* eslint-disable react/prop-types */
import { Pagination, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Can from "./Can";
import Loading from "./Loading/Loading";

const Table = ({
  title = "Table",
  columns = [],
  data = [],
  actions = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search...",
  renderExtraContent,
  getRowClass = () => "",
}) => {
  const textInputRef = useRef(null);
  const [localSearch, setLocalSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setLocalSearch(value);
    onSearch?.(value);
    if (onPageChange) onPageChange(1);
  };

  return (
    <div className="mt-5 overflow-x-auto">
      <div className="overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between mb-5">
          <h3 className="mb-3 text-xl md:text-3xl font-bold">{title}</h3>
          <div className="flex items-center searcList">
            <div className="searchGroup" style={{ minWidth: "200px" }}>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={localSearch}
                ref={textInputRef}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete="off"
                style={{ width: "100%" }}
              />
            </div>
            <button
              className="SearchBtn"
              onClick={() => handleSearch(localSearch)}
              style={{ minWidth: "80px" }}
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <section className="tableContainer overflow-x-auto">
            <table className="customTable">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  {actions.length > 0 && (
                    <th colSpan={actions.length}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <TableRow
                    key={item._id || index}
                    item={item}
                    index={index}
                    columns={columns}
                    actions={actions}
                    currentPage={currentPage}
                    pageSize={data.length}
                    navigate={navigate}
                    getRowClass={getRowClass}
                  />
                ))}
              </tbody>
            </table>
          </section>
        )}

        {renderExtraContent && renderExtraContent()}

        {totalPages > 1 && onPageChange && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              color="primary"
              onChange={(_, page) => onPageChange(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- TableRow Component ---
const TableRow = ({
  item,
  index,
  columns,
  actions,
  currentPage,

  navigate,
  getRowClass,
}) => {
  const globalIndex = (currentPage - 1) * 10 + (index + 1);
  const rowClass = getRowClass(item);

  return (
    <tr
      className={`${rowClass} hover:bg-blue-300 transition-colors duration-200 hover:text-black`}
    >
      {columns.map((col) => {
        let value = null;
        if (col.type === "index") value = globalIndex;
        else if (col.render) value = col.render(item, index);
        else if (col.key.includes(".")) {
          value =
            col.key.split(".").reduce((obj, k) => obj?.[k], item) ?? "N/A";
        } else value = item[col.key] ?? "N/A";
        return <td key={col.key}>{value}</td>;
      })}
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <td
            key={action.key}
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              padding: "8px",
            }}
          >
            {action.requirePermission ? (
              <Can
                page={action.permissionPage}
                action={action.permissionAction}
              >
                <ActionButton
                  action={action}
                  Icon={Icon}
                  item={item}
                  navigate={navigate}
                />
              </Can>
            ) : (
              <ActionButton
                action={action}
                Icon={Icon}
                item={item}
                navigate={navigate}
              />
            )}
          </td>
        );
      })}
    </tr>
  );
};

const ActionButton = ({ action, Icon, item, navigate }) => {
  const isDisabled = action.disabled?.(item);

  const iconStyle = {
    color: action.color || "#2563EB",
    fontSize: action.size || "18px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
  };

  const content = () => {
    if (action.href)
      return (
        <a
          href={
            typeof action.href === "function" ? action.href(item) : action.href
          }
          target={action.target}
          rel="noreferrer"
          style={{ pointerEvents: isDisabled ? "none" : "auto" }}
        >
          <Icon style={iconStyle} />
        </a>
      );

    if (action.link)
      return (
        <Link
          to={
            typeof action.link === "function" ? action.link(item) : action.link
          }
          style={{ pointerEvents: isDisabled ? "none" : "auto" }}
        >
          <Icon style={iconStyle} />
        </Link>
      );

    return (
      <button
        onClick={() => !isDisabled && action.onClick?.(item, { navigate })}
        disabled={isDisabled}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        <Icon style={iconStyle} />
      </button>
    );
  };

  const tooltipTitle =
    typeof action.tooltip === "function"
      ? action.tooltip(item)
      : action.tooltip;

  if (tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle} arrow>
        {isDisabled ? (
          <span style={{ display: "inline-block" }}>{content()}</span>
        ) : (
          content()
        )}
      </Tooltip>
    );
  }

  return content();
};

export default Table;
