/* eslint-disable react/prop-types */
import { Link, NavLink } from "react-router-dom";
import { SIDEBAR_STYLES } from "./sidebarStyles";

const SingleMenuItem = ({ item }) => {
  if (item.condition === false) return null;

  if (item.action) {
    return (
      <div key={item.id} className="pl-4 space-y-3 mt-3 mb-20">
        <div onClick={item.action} className={SIDEBAR_STYLES.dashboardItem}>
          {item.icon}
          <span className="ml-2">{item.text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      key={item.id}
      className={item.id === "dashboard" ? "" : "pl-4 space-y-3 mt-3"}
    >
      {item.id === "dashboard" ? (
        <NavLink to={item.link} className="z-10 flex p-4 items-center">
          {item.icon}
          <h3 className="text-xl font-semibold ml-2">{item.text}</h3>
        </NavLink>
      ) : (
        <Link to={item.link}>
          <div className={SIDEBAR_STYLES.dashboardItem}>
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SingleMenuItem;
