export const fixDateTimeFormat = (dateTimeString) => {
  if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
    return dateTimeString + ":00.000Z";
  }
};
