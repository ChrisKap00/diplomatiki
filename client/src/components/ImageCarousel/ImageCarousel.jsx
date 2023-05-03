import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ImageCarousel = ({ images, setImages }) => {
  const [image, setImage] = useState(0);
  const prev = useRef();
  const next = useRef();

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setImages(null);
      else if (e.key === "ArrowLeft") {
        if (prev.current) {
          prev.current.click();
        }
      } else if (e.key === "ArrowRight") {
        if (next.current) {
          next.current.click();
        }
      }
    });
  }, []);

  useEffect(() => {
    console.log(image);
  }, [image]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        // overscrollBehavior: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // overflowY: "hidden",
        // width: "100%",
        // height: "100%",
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={() => {
          setImages(null);
        }}
      >
        <Close
          sx={{
            width: "40px",
            height: "40px",
          }}
        />
      </IconButton>
      <Box
        sx={{
          width: "100%",
          //   backgroundColor: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            // backgroundColor: "blue",
            padding: "1rem",
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            cursor: "pointer",
          }}
          component="div"
          onClick={() => {
            setImage(image === 0 ? images.length - 1 : image - 1);
          }}
          ref={prev}
        >
          <ArrowBack />
        </Box>
        <img
          src={images[image]}
          style={{ objectFit: "contain", userSelect: "none" }}
        ></img>
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            // backgroundColor: "blue",
            padding: "1rem",
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            cursor: "pointer",
          }}
          component="div"
          onClick={() => {
            setImage(image === images.length - 1 ? 0 : image + 1);
          }}
          ref={next}
        >
          <ArrowForward />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          width: "100%",
          padding: "2rem",
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            style={{
              objectFit: "contain",
              height: "70px",
              marginInline: "5px",
              border: index === image ? "3px solid white" : "none",
              userSelect: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              setImage(index);
            }}
          ></img>
        ))}
      </Box>
    </Box>
  );
};

export default ImageCarousel;
