
import { Box } from "@mui/material";
import designConfig from '../../config/designConfig';
import DashboardHeader from "./components/HeaderSection";

export default function Home() {
    return (
        <Box sx={{ bgcolor: designConfig.colors.background.light, minHeight: "100vh", pb: 10 }}>
            {/* 1. Header Section */}
            <DashboardHeader />
        </Box>
    );
}
