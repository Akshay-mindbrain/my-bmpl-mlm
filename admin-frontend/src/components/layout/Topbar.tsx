import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetAdmin } from "../../hooks/Admin/useGetAdmin";
import { useLogout } from "../../hooks/Auth/useLogout";

const Topbar = () => {
  const [langMenu, setLangMenu] = useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);

  const { mutate: logoutMutate } = useLogout();
  const navigate = useNavigate();

  // ✅ fetch admin
  const { data: adminData, isLoading } = useGetAdmin();

  // ✅ logout
  const handleLogout = () => {
    logoutMutate(
      {},
      {
        onSuccess: () => {
          setUserMenu(null);
          toast.success("Logout Successful");
          navigate("/login");
        },
        onError: (error: any) => {
          toast.error("Logout error: " + error.message);
          console.error("Logout error:", error.message);
        },
      }
    );
  };

  // ✅ Safe full name
  const fullName =
    `${adminData?.data?.firstName ?? ""} ${adminData?.data?.lastName ?? ""}`.trim() ||
    "Admin User";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#333",
        borderBottom: "1px solid #e6e8ec",
        px: 2,
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }} />

        {/* Language Menu */}
        <Menu
          anchorEl={langMenu}
          open={Boolean(langMenu)}
          onClose={() => setLangMenu(null)}
        >
          <MenuItem onClick={() => setLangMenu(null)}>English</MenuItem>
          <MenuItem onClick={() => setLangMenu(null)}>Hindi</MenuItem>
        </Menu>

        {/* USER PROFILE */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={(e) => setUserMenu(e.currentTarget)}
        >
          <Avatar sx={{ width: 40, height: 40 }}>
            {fullName.charAt(0)}
          </Avatar>

          <Box sx={{ ml: 1 }}>
            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <Typography sx={{ fontWeight: 600 }}>
                {fullName}
              </Typography>
            )}

            <Typography sx={{ fontSize: 12, color: "#7a7f85" }}>
              {adminData?.data?.adminType || "Admin"}
            </Typography>
          </Box>

          <KeyboardArrowDownIcon sx={{ ml: 1 }} />
        </Box>

        {/* USER MENU */}
        <Menu
          anchorEl={userMenu}
          open={Boolean(userMenu)}
          onClose={() => setUserMenu(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            component={Link}
            to="/profile"
            onClick={() => setUserMenu(null)}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;