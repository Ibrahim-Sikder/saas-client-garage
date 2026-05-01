/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ExpandLess } from "@mui/icons-material";
import { SIDEBAR_STYLES } from "./sidebarStyles";

const AccordionMenuItem = ({ item, expanded, handleChange }) => {
  if (item.condition === false) return null;

  return (
    <Accordion
      key={item.id}
      sx={{ paddingBottom: "10px" }}
      className={SIDEBAR_STYLES.accordion}
      expanded={expanded === item.id}
      onChange={handleChange(item.id)}
    >
      <AccordionSummary
        sx={{ marginBottom: "-10px" }}
        expandIcon={<ExpandLess className="accordionExpandIcon" />}
        aria-controls={`${item.id}-content`}
        id={`${item.id}-header`}
        className={
          item.id === "panel12" || item.id === "panel2"
            ? SIDEBAR_STYLES.accordionSummary
            : ""
        }
      >
        <Typography>
          <div className="flex items-center justify-center">
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </div>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {item.items.map((subItem, index) => (
          <NavLink
            key={index}
            to={subItem.link}
            className={SIDEBAR_STYLES.accordionDetails}
          >
            <div className="">{subItem.icon}</div>
            <div className="text-sm font-normal">{subItem.text}</div>
          </NavLink>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionMenuItem;
