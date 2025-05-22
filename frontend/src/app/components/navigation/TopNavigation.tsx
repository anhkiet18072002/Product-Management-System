import React, { useEffect, useState } from "react";
import {
  alpha,
  Avatar,
  Box,
  BoxProps,
  styled,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import {
  MenuFoldOutlined,
  NotificationOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import IconButton from "@/app/components/button/IconButton";
import { getInitials } from "@/app/utils/name.util";
import { useAccessToken } from "@/app/hooks/useAccessToken";
import { jwtDecode } from "jwt-decode";
import { userClient } from "@/app/hooks/api/user.api";

const ContainerStyled = styled(Box)<BoxProps>({
  alignItems: "center",
  backgroundColor: "white",
  border: "1px solid #F0F0F0",
  display: "flex",
  justifyContent: "space-between",
  minHeight: "60px",
  paddingLeft: "12px",
  paddingRight: "12px",
  width: "100%",
});

const SearchInputStyled = styled(TextField)<TextFieldProps>(({ theme }) => ({
  fontSize: "16px",
  marginLeft: "12px",
  width: "376px",
  "& .MuiOutlinedInput-root": {
    paddingRight: "4px",
    "& .MuiOutlinedInput-input": {
      fontSize: "16px",
      padding: "10px 8px 10px 12px",
    },
    "&:hover": {
      "& fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px !important",
      },
    },
  },
  "& .Mui-focused": {
    boxShadow: `${alpha(theme.palette.primary.main, 0.2)} 0px 0px 0px 2px;`,

    "& fieldset": {
      borderWidth: "1px !important",
    },
  },
}));

interface DecodedToken {
  email?: string;
}

const TopNavigation = () => {
  const accessToken = useAccessToken();
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(accessToken);
          if (decoded.email) {
            try {
              const user = await userClient.findByEmail(decoded.email);
              if (user) {
                setUsername(user.username);
              }
            } catch (err) {
              console.log("Error", err);
            }

            // xử lý gì đó với user nếu cần
          }
        } catch (err) {
          console.error("Error decoding token or fetching user:", err);
        }
      }
    };

    fetchUser();
  }, [accessToken]);

  return (
    <ContainerStyled>
      <Box sx={{ alignItems: "center", display: "flex" }}>
        <IconButton>
          <MenuFoldOutlined style={{ color: "black", fontSize: "20px" }} />
        </IconButton>
        <SearchInputStyled
          placeholder="Search"
          slotProps={{
            input: {
              startAdornment: (
                <SearchOutlined style={{ color: "black", fontSize: "20px" }} />
              ),
            },
          }}
        />
      </Box>
      <Box sx={{ alignItems: "center", display: "flex" }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            marginRight: "22px",
          }}
        >
          <IconButton>
            <NotificationOutlined
              style={{ color: "black", fontSize: "20px" }}
            />
          </IconButton>
        </Box>
        <Box sx={{ alignItems: "center", display: "flex" }}>
          <Avatar sx={{ fontSize: "14px", width: "32px", height: "32px" }}>
            {getInitials({ firstName: "Admin", lastName: "Super" })}
          </Avatar>
          <Typography sx={{ fontSize: "14px", padding: "10px" }}>
            {`${username}`}
          </Typography>
        </Box>
      </Box>
    </ContainerStyled>
  );
};

export default TopNavigation;
