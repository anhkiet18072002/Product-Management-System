import React, { useEffect, useRef, useState } from "react";
import {
  alpha,
  Avatar,
  Box,
  BoxProps,
  Button,
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
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/app/configs/route.config";
import { useAuth } from "@/app/hooks/useAuth";

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

interface DecodedToken {
  email?: string;
}

const TopNavigation = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const accessToken = useAccessToken();
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    router.push(PAGE_ROUTES.LOGIN);
  };

  const handleLogout = () => {
    // xử lý logout
    logout();
  };

  return (
    <ContainerStyled>
      <Box sx={{ position: "relative", ml: "auto" }} ref={dropdownRef}>
        <Box
          sx={{ alignItems: "center", display: "flex", cursor: "pointer" }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Avatar sx={{ fontSize: "14px", width: "32px", height: "32px" }}>
            {getInitials({ firstName: "Admin", lastName: "Super" })}
          </Avatar>
          <Typography sx={{ fontSize: "14px", padding: "10px" }}>
            {username}
          </Typography>
        </Box>

        {open && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ddd",
              boxShadow: 2,
              zIndex: 10,
              mt: 1,
              p: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {!accessToken && (
              <Button variant="outlined" size="small" onClick={handleLogin}>
                Login
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </ContainerStyled>
  );
};

export default TopNavigation;
