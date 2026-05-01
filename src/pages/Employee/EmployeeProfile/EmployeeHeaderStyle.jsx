import { Box } from '@mui/material';

const EmployeeHeaderStyle = () => {
  return (
    <Box
      sx={{
        height: 150,
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)",
        backgroundSize: "400% 400%",


      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -30,
          left: -30,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",

        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "20%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",

        }}
      />
    </Box>
  );
};

export default EmployeeHeaderStyle;