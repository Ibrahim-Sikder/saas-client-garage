import * as MuiIcons from "@mui/icons-material";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";

export const getIcon = (iconName, iconLibrary = "mui", size = 22) => {
  if (iconLibrary === "mui") {
    const IconComponent = MuiIcons[iconName];
    return IconComponent ? <IconComponent size={size} /> : null;
  } else if (iconLibrary === "fa") {
    const IconComponent = FaIcons[iconName];
    return IconComponent ? (
      <IconComponent size={size} className="h-5 w-5" />
    ) : null;
  } else if (iconLibrary === "hi") {
    const IconComponent = HiIcons[iconName];
    return IconComponent ? (
      <IconComponent size={size} className="h-5 w-5" />
    ) : null;
  } else if (iconLibrary === "tb") {
    const IconComponent = TbIcons[iconName];
    return IconComponent ? (
      <IconComponent size={size} className="h-5 w-5" />
    ) : null;
  } else if (iconLibrary === "md") {
    const IconComponent = MdIcons[iconName];
    return IconComponent ? (
      <IconComponent size={size} className="h-5 w-5" />
    ) : null;
  }
  return null;
};
