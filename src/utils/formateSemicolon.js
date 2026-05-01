export const formateNumber = (num) => {
  if (num === undefined || num === null || num === "") return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
