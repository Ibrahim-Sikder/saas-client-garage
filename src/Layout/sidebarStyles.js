export const SIDEBAR_STYLES = {
  container: "flex",
  sidebar: (toggle) =>
    toggle
      ? "fixed overflow-y-scroll overflow-x-hidden drawwerLeftSide h-screen text-lg font-semibold bg-[#2C3136] text-white pt-16"
      : "fixed overflow-y-scroll overflow-x-hidden sideBarActive h-screen text-lg font-semibold bg-[#2C3136] text-white ",
  rightSidebar: (toggle) =>
    toggle ? "rightSideBarWrap" : "activeRightSideBarWrap",
  dashboardItem: "flex items-center dashboardItems cursor-pointer",
  accordion: "dashboardAccordion",
  accordionSummary: "dashboardAccordionSummary",
  accordionDetails:
    "flex items-center content-center gap-3 p-2 pl-6 hover:bg-[#3a3f45] rounded transition-colors duration-200",
};
