import { Box, Card } from "@mui/material";
import React from "react";

const LoadingPost = () => {
  return (
    <Card
      sx={{
        width: { xs: "100%", xl: "90%" },
        marginBottom: "20px",
      }}
      elevation={10}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          height: "fit-content",
        }}
      >
        <Box>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            paddingLeft: "15px",
            height: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            // backgroundColor: "red",
            paddingBlock: "5px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              width: "200px",
              height: "10px",
            }}
          ></Box>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              width: "120px",
              height: "10px",
            }}
          ></Box>
        </Box>
      </Box>
      <Box sx={{ padding: "1rem", paddingBottom: "4rem" }}>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            width: "70%",
            height: "10px",
            marginBottom: "10px",
          }}
        ></Box>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            width: "45%",
            height: "10px",
            marginBottom: "10px",
          }}
        ></Box>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            width: "55%",
            height: "10px",
            marginBottom: "10px",
          }}
        ></Box>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            width: "100%",
            height: "40px",
            marginTop: "40px",
            marginBottom: "10px",
          }}
        ></Box>
      </Box>
      <Box sx={{ padding: "1rem" }}>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            width: "100px",
            height: "10px",
          }}
        ></Box>
      </Box>
    </Card>
  );
};

export default LoadingPost;
