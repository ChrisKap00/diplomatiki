import { ArrowDropDown } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DropdownStyle = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: "#404040",
  "&:hover": {
    backgroundColor: "#565656",
  },
  width: "fit-content",
  minWidth: "200px",
  height: "fit-content",
  padding: "0.3rem 0.5rem 0.3rem 1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
}));

const Dropdown = ({
  selectedGroup,
  setSelectedGroup,
  postData,
  setPostData,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.groups);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    });
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          display: open ? "block" : "none",
        }}
        onClick={() => {
          setOpen(false);
        }}
      ></div>
      <Box>
        <DropdownStyle onClick={() => setOpen(!open)}>
          <Typography>
            {selectedGroup === null
              ? "Επιλέξτε ομάδα"
              : selectedGroup.code + " - " + selectedGroup.name}
          </Typography>
          <ArrowDropDown />
        </DropdownStyle>
        <Box
          sx={{
            position: "absolute",
            zIndex: 10,
            marginTop: "3px",
            borderRadius: "20px",
            backgroundColor: "#404040",
            width: "fit-content",
            minWidth: "200px",
            height: open ? "fit-content" : "0px",
            maxHeight: "300px",
            overflow: "auto",
            cursor: "pointer",
            transition: "0.2s ease-out",
          }}
        >
          {groups &&
            groups.map(
              (group, index) =>
                group.users.findIndex((e) => e._id === user.result._id) >
                  -1 && (
                  <Box
                    key={index}
                    sx={{
                      padding: "0.5rem 1rem",
                      position: "relative",
                      borderRadius:
                        index === 0
                          ? "20px 20px 0 0"
                          : index === groups.length - 1
                          ? "0 0 20px 20px"
                          : 0,
                      "&:hover": {
                        backgroundColor: "#565656",
                      },
                    }}
                  >
                    <Typography>
                      {group.code} - {group.name}
                    </Typography>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                      onClick={() => {
                        setSelectedGroup(group);
                        setPostData({
                          ...postData,
                          groupId: group._id,
                          groupName: `${group.code} - ${group.name}`,
                        });
                        setOpen(false);
                      }}
                    ></div>
                  </Box>
                )
            )}
        </Box>
      </Box>
    </>
  );
};

export default Dropdown;
