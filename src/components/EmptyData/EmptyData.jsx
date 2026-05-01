/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { Box, Typography } from "@mui/material";

const EmptyData = ({
  icon: Icon, 
  title = "No Data Found", 
  message = "We couldn't find any data matching your criteria.",
  subMessage = "Try adjusting your filters or add new data.", 
  iconStyle = {}, 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      textAlign="center"
    >
      {Icon && (
        <Icon
          style={{
            fontSize: 80,
            color: "#9e9e9e",
            marginBottom: "16px",
            ...iconStyle, 
          }}
        />
      )}
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
      {subMessage && (
        <Typography variant="body2" color="textSecondary">
          {subMessage}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyData;
